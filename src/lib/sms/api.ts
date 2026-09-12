import { createServerFn } from "@tanstack/react-start";
import { FROM_NUMBER, SMS_MAX_CHARS } from "./constants";
import { copy } from "./copy";
import {
  isUsOrCanada,
  nameTokensOk,
  normalizeE164,
  RECIPIENT_LIMIT,
  type SendMode,
} from "./phone";

export const getSmsLine = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const { getLineStatus } = await import("./mailersend.server");
    return await getLineStatus();
  } catch (err) {
    const { parseMailerSendError } = await import("./mailersend.server");
    return {
      connected: false,
      from: FROM_NUMBER,
      paused: false,
      error: parseMailerSendError(err),
    };
  }
});

export const getChannelStatus = createServerFn({ method: "POST" }).handler(
  async () => {
    const [{ getLineStatus, parseMailerSendError }, sendblue, whatsapp] =
      await Promise.all([
        import("./mailersend.server"),
        import("./sendblue.server"),
        import("./whatsapp.server"),
      ]);
    const [sms, imessage, wa] = await Promise.all([
      getLineStatus().catch((err) => ({
        connected: false,
        from: FROM_NUMBER,
        paused: false,
        error: parseMailerSendError(err),
      })),
      sendblue.getSendblueLine(),
      whatsapp.getWhatsAppLine(),
    ]);
    let contacts: Array<{ name: string; phone: string }> = [];
    try {
      contacts = await sendblue.listSendblueContacts();
    } catch {
      contacts = [];
    }
    return { sms, imessage, whatsapp: wa, contacts };
  },
);

export const sendSms = createServerFn({ method: "POST" })
  .validator(
    (input: {
      to: string[];
      text: string;
      names?: Record<string, string>;
      channel?: SendMode;
    }) => {
      const channel: SendMode =
        input.channel === "imessage"
          ? "imessage"
          : input.channel === "whatsapp"
            ? "whatsapp"
            : "sms";
      const to = (input.to ?? [])
        .map((value) => normalizeE164(value))
        .filter((value): value is string => Boolean(value));
      const unique = [...new Set(to)];
      if (unique.length === 0) throw new Error(copy.invalidNumber);
      if (unique.length > RECIPIENT_LIMIT) throw new Error(copy.tooMany);
      if (channel === "sms" && unique.some((n) => !isUsOrCanada(n))) {
        throw new Error(copy.usCaOnly);
      }
      const text = input.text.trim();
      if (!text) throw new Error(copy.writeFirst);
      if (text.length > SMS_MAX_CHARS) {
        throw new Error(`Zpráva může mít nejvýš ${SMS_MAX_CHARS} znaků.`);
      }
      if (!nameTokensOk(text)) throw new Error(copy.removeBraces);
      if (text.includes("{{name}}")) {
        const missing = unique.filter((n) => !input.names?.[n]);
        if (missing.length) throw new Error(copy.needNameToken);
      }
      return { to: unique, text, names: input.names ?? {}, channel };
    },
  )
  .handler(async ({ data }) => {
    if (data.channel === "imessage") {
      const { dispatchIMessage } = await import("./sendblue.server");
      const results = [];
      for (const to of data.to) {
        try {
          const result = await dispatchIMessage({
            to,
            text: data.text,
            name: data.names[to],
          });
          results.push({ ok: true as const, ...result });
        } catch (err) {
          results.push({
            ok: false as const,
            to,
            error:
              err instanceof Error ? err.message : "Sendblue zprávu neodeslal.",
          });
        }
      }
      const firstOk = results.find((row) => row.ok);
      const firstFail = results.find((row) => !row.ok);
      if (firstOk && firstOk.ok) {
        return {
          ok: true as const,
          messageId: firstOk.messageId,
          from: firstOk.from,
          to: data.to,
          paused: false,
          channel: "imessage" as const,
          errors: firstFail && !firstFail.ok ? firstFail.error : undefined,
        };
      }
      return {
        ok: false as const,
        error:
          firstFail && !firstFail.ok
            ? firstFail.error
            : "Sendblue zprávu neodeslal.",
      };
    }

    if (data.channel === "whatsapp") {
      const { dispatchWhatsApp } = await import("./whatsapp.server");
      const results = [];
      for (const to of data.to) {
        try {
          const result = await dispatchWhatsApp({
            to,
            text: data.text,
            name: data.names[to],
          });
          results.push({ ok: true as const, ...result });
        } catch (err) {
          results.push({
            ok: false as const,
            to,
            error:
              err instanceof Error ? err.message : "WhatsApp zprávu neodeslal.",
          });
        }
      }
      const firstOk = results.find((row) => row.ok);
      const firstFail = results.find((row) => !row.ok);
      if (firstOk && firstOk.ok) {
        return {
          ok: true as const,
          messageId: firstOk.messageId,
          from: firstOk.from,
          to: data.to,
          paused: false,
          channel: "whatsapp" as const,
          errors: firstFail && !firstFail.ok ? firstFail.error : undefined,
        };
      }
      return {
        ok: false as const,
        error:
          firstFail && !firstFail.ok
            ? firstFail.error
            : "WhatsApp zprávu neodeslal.",
      };
    }

    const { dispatchSms, parseMailerSendError } = await import(
      "./mailersend.server"
    );
    try {
      const result = await dispatchSms(data);
      return { ok: true as const, channel: "sms" as const, ...result };
    } catch (err) {
      return { ok: false as const, error: parseMailerSendError(err) };
    }
  });

export const getSmsStatus = createServerFn({ method: "POST" })
  .validator((input: { messageId: string; channel?: SendMode }) => {
    const messageId = input.messageId.trim();
    if (!messageId) throw new Error(copy.noId);
    return {
      messageId,
      channel:
        input.channel === "imessage"
          ? "imessage"
          : input.channel === "whatsapp"
            ? "whatsapp"
            : "sms",
    };
  })
  .handler(async ({ data }) => {
    if (data.channel === "whatsapp") {
      return {
        ok: true as const,
        status: "queued" as const,
        error: undefined,
        segmentCount: undefined as number | undefined,
      };
    }
    if (data.channel === "imessage") {
      try {
        const { getSendblueMessageStatus } = await import(
          "./sendblue.server"
        );
        const result = await getSendblueMessageStatus(data.messageId);
        return { ok: true as const, ...result };
      } catch (err) {
        return {
          ok: false as const,
          error: err instanceof Error ? err.message : copy.refreshFail,
        };
      }
    }
    const { getSmsMessageStatus, parseMailerSendError } = await import(
      "./mailersend.server"
    );
    try {
      const result = await getSmsMessageStatus(data.messageId);
      return { ok: true as const, ...result };
    } catch (err) {
      return { ok: false as const, error: parseMailerSendError(err) };
    }
  });

export const lookupService = createServerFn({ method: "POST" })
  .validator((input: { number: string }) => {
    const number = normalizeE164(input.number);
    if (!number) throw new Error(copy.invalidNumber);
    return { number };
  })
  .handler(async ({ data }) => {
    try {
      const { evaluateService } = await import("./sendblue.server");
      return { ok: true as const, ...(await evaluateService(data.number)) };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Službu se nepodařilo zjistit.",
      };
    }
  });

export const listSmsHistory = createServerFn({ method: "POST" }).handler(
  async () => {
    const mailer = await import("./mailersend.server");
    const blue = await import("./sendblue.server");
    const [sms, imessage] = await Promise.all([
      mailer.listRecentMessages().then(
        (messages) => ({ ok: true as const, messages }),
        (err) => ({
          ok: false as const,
          error: mailer.parseMailerSendError(err),
          messages: [] as Awaited<
            ReturnType<typeof mailer.listRecentMessages>
          >,
        }),
      ),
      blue.listSendblueMessages().then(
        (messages) => ({ ok: true as const, messages }),
        (err) => ({
          ok: false as const,
          error: err instanceof Error ? err.message : copy.historyFail,
          messages: [] as Awaited<ReturnType<typeof blue.listSendblueMessages>>,
        }),
      ),
    ]);
    return { sms, imessage };
  },
);

export const saveWhatsApp = createServerFn({ method: "POST" })
  .validator(
    (input: {
      token: string;
      phoneNumberId: string;
      template?: string;
      language?: string;
    }) => ({
      token: String(input.token ?? "").trim(),
      phoneNumberId: String(input.phoneNumberId ?? "").trim(),
      template: String(input.template ?? "hello_world").trim() || "hello_world",
      language: String(input.language ?? "en_US").trim() || "en_US",
    }),
  )
  .handler(async ({ data }) => {
    const { saveWhatsAppConfig } = await import("./whatsapp.server");
    try {
      const result = await saveWhatsAppConfig(data);
      return { ok: true as const, ...result };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "WhatsApp se nepodařilo ověřit.",
      };
    }
  });

