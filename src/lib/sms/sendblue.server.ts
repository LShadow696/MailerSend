const API_KEY =
  process.env.SENDBLUE_API_KEY ?? "39992f0c244afc9ce2089556633c6c4b";
const API_SECRET =
  process.env.SENDBLUE_API_SECRET ??
  "85cfa18ebb1a03459b73284ad35adb66";

export const SENDBLUE_FROM = "+19176257748";

async function sendblue<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`https://api.sendblue.co${path}`, {
    ...init,
    headers: {
      "sb-api-key-id": API_KEY,
      "sb-api-secret-key": API_SECRET,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text };
  }
  if (!res.ok) {
    const err = body as { error_message?: string; message?: string };
    throw new Error(
      err.error_message || err.message || `Sendblue vrátil ${res.status}.`,
    );
  }
  return body as T;
}

export type IMessageLine = {
  connected: boolean;
  from: string;
  paused: boolean;
  status?: string;
  error?: string;
};

export async function getSendblueLine(): Promise<IMessageLine> {
  try {
    const state = await sendblue<{
      data?: Array<{
        sendblue_number?: string;
        status?: string;
      }>;
    }>("/api/v2/lines/state");
    const row = state.data?.[0];
    const from = row?.sendblue_number || SENDBLUE_FROM;
    const online = (row?.status ?? "").toUpperCase() === "ONLINE";
    return {
      connected: online,
      from,
      paused: !online,
      status: row?.status,
      error: online ? undefined : "Sendblue linka není online.",
    };
  } catch (err) {
    return {
      connected: false,
      from: SENDBLUE_FROM,
      paused: false,
      error: err instanceof Error ? err.message : "Sendblue je offline.",
    };
  }
}

export async function evaluateService(number: string) {
  const encoded = encodeURIComponent(number);
  const res = await sendblue<{
    number?: string;
    service?: string;
  }>(`/api/evaluate-service?number=${encoded}`);
  const raw = (res.service ?? "SMS").toLowerCase();
  const service =
    raw === "imessage" ? "iMessage" : raw === "rcs" ? "RCS" : "SMS";
  return { number: res.number ?? number, service };
}

function applyName(text: string, name?: string) {
  if (!name) return text.replaceAll("{{name}}", "");
  return text.replaceAll("{{name}}", name);
}

export async function dispatchIMessage(input: {
  to: string;
  text: string;
  name?: string;
}) {
  const line = await getSendblueLine();
  const from = line.from || SENDBLUE_FROM;
  const content = applyName(input.text, input.name);
  const res = await sendblue<{
    message_handle?: string;
    status?: string;
    service?: string;
    was_downgraded?: boolean;
    error_message?: string;
    error_code?: number | string | null;
  }>("/api/send-message", {
    method: "POST",
    body: JSON.stringify({
      from_number: from,
      number: input.to,
      content,
    }),
  });
  const status = (res.status ?? "QUEUED").toUpperCase();
  if (status === "ERROR" || res.error_message) {
    throw new Error(res.error_message || "Sendblue zprávu neodeslal.");
  }
  return {
    messageId: res.message_handle ?? "",
    from,
    to: input.to,
    service: res.service ?? "iMessage",
    paused: false,
    statusCode: 200,
  };
}

export async function getSendblueMessageStatus(messageId: string) {
  const res = await sendblue<{
    data?: {
      status?: string;
      error_message?: string | null;
      service?: string;
      was_downgraded?: boolean | null;
    };
  }>(`/api/v2/messages/${encodeURIComponent(messageId)}`);
  const row = res.data ?? {};
  const raw = (row.status ?? "QUEUED").toUpperCase();
  const status =
    raw === "DELIVERED" || raw === "RECEIVED"
      ? ("sent" as const)
      : raw === "SENT"
        ? ("processed" as const)
        : raw === "ERROR" || raw === "FAILED"
          ? ("failed" as const)
          : ("queued" as const);
  return {
    status,
    error: row.error_message || undefined,
    service: row.service,
    segmentCount: undefined as number | undefined,
  };
}

export type RemoteBlueMessage = {
  id: string;
  from: string;
  to: string;
  text: string;
  status: string;
  service: string;
  createdAt: string;
};

export async function listSendblueMessages(): Promise<RemoteBlueMessage[]> {
  const res = await sendblue<{
    data?: Array<{
      message_handle?: string;
      from_number?: string;
      to_number?: string;
      content?: string;
      status?: string;
      service?: string;
      is_outbound?: boolean;
      date_sent?: string;
    }>;
  }>("/api/v2/messages?limit=10&is_outbound=true");
  return (res.data ?? [])
    .filter((row) => row.message_handle && row.is_outbound !== false)
    .map((row) => ({
      id: String(row.message_handle),
      from: row.from_number ?? "",
      to: row.to_number ?? "",
      text: row.content ?? "",
      status: row.status ?? "QUEUED",
      service: row.service ?? "iMessage",
      createdAt: row.date_sent ?? "",
    }));
}

export async function listSendblueContacts() {
  const rows = await sendblue<
    Array<{
      first_name?: string;
      last_name?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    }>
  >("/api/v2/contacts?limit=16");
  const list = Array.isArray(rows) ? rows : [];
  return list
    .filter((row) => row.phone)
    .map((row) => {
      const first = row.first_name || row.firstName || "";
      const last = row.last_name || row.lastName || "";
      return {
        name: `${first} ${last}`.trim() || row.phone || "",
        phone: row.phone || "",
      };
    });
}
