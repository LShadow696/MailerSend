import { MailerSend, SMSParams, SMSPersonalization } from "mailersend";
import { FROM_NUMBER } from "./constants";

const API_KEY =
  process.env.MAILERSEND_API_KEY ??
  "mlsn.321275360491054c9024d0fd91cdf2b9fe938eca70b6c2c0cc376800bb8de0a8";

function client() {
  return new MailerSend({ apiKey: API_KEY });
}

type NumberRow = {
  id: string;
  telephone_number: string;
  paused: boolean;
};

export type LineStatus = {
  connected: boolean;
  from: string;
  paused: boolean;
  error?: string;
};

export type DeliveryStatus =
  | "queued"
  | "processed"
  | "sent"
  | "failed"
  | "paused";

export async function getLineStatus(): Promise<LineStatus> {
  const res = await client().sms.number.list({ limit: 10 });
  const rows = (res.body?.data ?? []) as NumberRow[];
  const match =
    rows.find((row) => row.telephone_number === FROM_NUMBER) ?? rows[0];
  if (!match) {
    return {
      connected: false,
      from: FROM_NUMBER,
      paused: false,
      error: "K tomuto účtu není připojené SMS číslo.",
    };
  }
  return {
    connected: true,
    from: match.telephone_number,
    paused: Boolean(match.paused),
  };
}

export async function dispatchSms(input: {
  to: string[];
  text: string;
  names?: Record<string, string>;
}) {
  const from = (await getLineStatus()).from || FROM_NUMBER;
  const smsParams = new SMSParams()
    .setFrom(from)
    .setTo(input.to)
    .setText(input.text);

  if (input.text.includes("{{name}}") && input.names) {
    smsParams.setPersonalization(
      input.to.map(
        (phone) =>
          new SMSPersonalization(phone, {
            name: input.names?.[phone] || phone,
          }),
      ),
    );
  }

  const res = await client().sms.send(smsParams);
  const headers = (res.headers ?? {}) as Record<string, string>;
  const messageId =
    headers["x-sms-message-id"] ??
    headers["X-SMS-Message-Id"] ??
    "";

  return {
    messageId,
    from,
    to: input.to,
    paused: headers["x-sms-send-paused"] === "true",
    statusCode: res.statusCode,
  };
}

type SmsRow = {
  status?: string;
  error_description?: string;
  segment_count?: number;
};

type ActivityRow = {
  status?: string;
};

export function mapDeliveryStatus(raw: string | undefined): DeliveryStatus {
  const s = (raw ?? "").toLowerCase();
  if (s === "sent" || s === "delivered") return "sent";
  if (s === "processed") return "processed";
  if (
    s === "failed" ||
    s === "rejected" ||
    s === "undelivered" ||
    s === "error"
  ) {
    return "failed";
  }
  if (s === "paused") return "paused";
  return "queued";
}

export async function getSmsMessageStatus(messageId: string) {
  const res = await client().sms.message.single(messageId);
  const data = res.body?.data as
    | {
        paused?: boolean;
        sms?: SmsRow[];
        sms_activity?: ActivityRow[];
      }
    | undefined;
  const sms = data?.sms?.[0];
  const activity = data?.sms_activity ?? [];
  const latest = activity[activity.length - 1];
  const status = mapDeliveryStatus(
    latest?.status ?? sms?.status ?? (data?.paused ? "paused" : "queued"),
  );
  return {
    status,
    error: sms?.error_description || undefined,
    segmentCount:
      typeof sms?.segment_count === "number" ? sms.segment_count : undefined,
  };
}

export type RemoteMessage = {
  id: string;
  from: string;
  to: string[];
  text: string;
  paused: boolean;
  createdAt: string;
};

export async function listRecentMessages(): Promise<RemoteMessage[]> {
  const res = await client().sms.message.list({ limit: 10 });
  const rows = (res.body?.data ?? []) as Array<{
    id?: string;
    from?: string;
    to?: string[];
    text?: string;
    paused?: boolean;
    created_at?: string;
  }>;
  return rows
    .filter((row) => row.id)
    .map((row) => ({
      id: String(row.id),
      from: row.from ?? "",
      to: Array.isArray(row.to) ? row.to : [],
      text: row.text ?? "",
      paused: Boolean(row.paused),
      createdAt: row.created_at ?? "",
    }));
}

export function parseMailerSendError(err: unknown): string {
  if (err && typeof err === "object" && "body" in err) {
    const body = (err as {
      body?: { message?: string; errors?: Record<string, string[]> };
    }).body;
    const details = body?.errors
      ? Object.values(body.errors).flat().filter(Boolean).join(" ")
      : "";
    if (details) return details;
    if (body?.message) return body.message;
    const status = (err as { statusCode?: number }).statusCode;
    if (status) return `MailerSend vrátil ${status}.`;
  }
  if (err instanceof Error && err.message) return err.message;
  return "MailerSend zprávu neodeslal.";
}
