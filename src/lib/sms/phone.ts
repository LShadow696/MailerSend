import { copy } from "./copy";

export const RECIPIENT_LIMIT = 8;

export type SendMode = "sms" | "imessage" | "whatsapp";

/** Normalize user input to E.164. */
export function normalizeE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("+")) {
    digits = `+${digits.slice(1).replace(/\D/g, "")}`;
  } else {
    const only = digits.replace(/\D/g, "");
    if (only.length === 10) digits = `+1${only}`;
    else if (only.length === 11 && only.startsWith("1")) digits = `+${only}`;
    else if (only.length === 9 && /^[67]\d{8}$/.test(only))
      digits = `+420${only}`;
    else if (only.length > 0) digits = `+${only}`;
    else return null;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(digits)) return null;
  return digits;
}

export function isUsOrCanada(e164: string): boolean {
  return /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(e164);
}

export function formatPretty(e164: string): string {
  const us = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  if (us) return `+1 ${us[1]} ${us[2]} ${us[3]}`;
  const cz = e164.match(/^\+420(\d{3})(\d{3})(\d{3})$/);
  if (cz) return `+420 ${cz[1]} ${cz[2]} ${cz[3]}`;
  return e164;
}

export function parseRecipients(raw: string): string[] {
  const parts = raw
    .split(/[,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    const e164 = normalizeE164(part);
    if (e164 && !out.includes(e164)) out.push(e164);
  }
  return out;
}

export function recipientsIssue(
  raw: string,
  mode: SendMode = "sms",
): string | null {
  const value = raw.trim();
  if (!value) return null;
  const parts = raw
    .split(/[,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > RECIPIENT_LIMIT) return copy.tooMany;
  for (const part of parts) {
    const e164 = normalizeE164(part);
    if (!e164) return copy.invalidNumber;
    if (mode === "sms" && !isUsOrCanada(e164)) return copy.usCaOnly;
  }
  if (parseRecipients(raw).length === 0) return copy.oneInvalid;
  return null;
}

export function nameTokensOk(text: string): boolean {
  const stripped = text.replaceAll("{{name}}", "");
  return !/[{}]/.test(stripped);
}
