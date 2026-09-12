import { copy } from "./copy";

export const RECIPIENT_LIMIT = 8;

/** Normalize user input to E.164. MailerSend SMS delivers to US and Canada only. */
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
  const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  if (m) return `+1 ${m[1]} ${m[2]} ${m[3]}`;
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

export function recipientsIssue(raw: string): string | null {
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
    if (!isUsOrCanada(e164)) return copy.usCaOnly;
  }
  if (parseRecipients(raw).length === 0) return copy.oneInvalid;
  return null;
}

export function nameTokensOk(text: string): boolean {
  const stripped = text.replaceAll("{{name}}", "");
  return !/[{}]/.test(stripped);
}
