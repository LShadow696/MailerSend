import { createServerFn } from "@tanstack/react-start";
import { FROM_NUMBER, SMS_MAX_CHARS } from "./constants";
import { copy } from "./copy";
import {
  isUsOrCanada,
  nameTokensOk,
  normalizeE164,
  RECIPIENT_LIMIT,
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

export const sendSms = createServerFn({ method: "POST" })
  .validator(
    (input: { to: string[]; text: string; names?: Record<string, string> }) => {
      const to = (input.to ?? [])
        .map((value) => normalizeE164(value))
        .filter((value): value is string => Boolean(value));
      const unique = [...new Set(to)];
      if (unique.length === 0) throw new Error(copy.invalidNumber);
      if (unique.length > RECIPIENT_LIMIT) throw new Error(copy.tooMany);
      if (unique.some((n) => !isUsOrCanada(n))) throw new Error(copy.usCaOnly);
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
      return { to: unique, text, names: input.names ?? {} };
    },
  )
  .handler(async ({ data }) => {
    const { dispatchSms, parseMailerSendError } = await import(
      "./mailersend.server"
    );
    try {
      const result = await dispatchSms(data);
      return { ok: true as const, ...result };
    } catch (err) {
      return { ok: false as const, error: parseMailerSendError(err) };
    }
  });

export const getSmsStatus = createServerFn({ method: "POST" })
  .validator((input: { messageId: string }) => {
    const messageId = input.messageId.trim();
    if (!messageId) throw new Error(copy.noId);
    return { messageId };
  })
  .handler(async ({ data }) => {
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

export const listSmsHistory = createServerFn({ method: "POST" }).handler(
  async () => {
    const { listRecentMessages, parseMailerSendError } = await import(
      "./mailersend.server"
    );
    try {
      const messages = await listRecentMessages();
      return { ok: true as const, messages };
    } catch (err) {
      return { ok: false as const, error: parseMailerSendError(err) };
    }
  },
);
