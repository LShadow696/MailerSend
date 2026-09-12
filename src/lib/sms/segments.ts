import { SMS_MAX_CHARS } from "./constants";

const GSM_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_EXT = "^{}\\[~]|€";

function isGsmChar(ch: string): boolean {
  return GSM_BASIC.includes(ch) || GSM_EXT.includes(ch);
}

export function gsmUnits(text: string): number {
  let units = 0;
  for (const ch of text) {
    if (GSM_EXT.includes(ch)) units += 2;
    else if (GSM_BASIC.includes(ch)) units += 1;
    else return -1;
  }
  return units;
}

export type SegmentInfo = {
  encoding: "GSM-7" | "UCS-2";
  units: number;
  perSegment: number;
  segments: number;
  remaining: number;
  overLimit: boolean;
  hasBraces: boolean;
};

export function analyzeMessage(text: string): SegmentInfo {
  const hasBraces = /[{}]/.test(text);
  const gsm = gsmUnits(text);
  const encoding = gsm >= 0 ? "GSM-7" : "UCS-2";
  const units = encoding === "GSM-7" ? gsm : [...text].length;
  const single = encoding === "GSM-7" ? 160 : 70;
  const concat = encoding === "GSM-7" ? 153 : 67;
  const segments = units === 0 ? 1 : units <= single ? 1 : Math.ceil(units / concat);
  const cap = segments <= 1 ? single : concat;
  const usedInLast = units === 0 ? 0 : units <= single ? units : units - (segments - 1) * concat;
  const remaining = Math.max(0, cap - usedInLast);
  return {
    encoding,
    units,
    perSegment: cap,
    segments: units === 0 ? 0 : segments,
    remaining,
    overLimit: text.length > SMS_MAX_CHARS,
    hasBraces,
  };
}

export function isGsmCompatible(text: string): boolean {
  return [...text].every(isGsmChar);
}
