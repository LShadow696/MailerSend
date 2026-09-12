import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CONFIG_PATH = path.join(process.cwd(), ".data", "whatsapp.json");
const GRAPH = "https://graph.facebook.com/v22.0";
const FALLBACK_TOKEN = process.env.WHATSAPP_API_KEY ?? "";

export type WhatsAppConfig = {
  token: string;
  phoneNumberId: string;
  wabaId?: string;
  template: string;
  language: string;
  displayPhone?: string;
  verifiedName?: string;
};

export type WhatsAppLine = {
  connected: boolean;
  from: string;
  paused: boolean;
  error?: string;
  verifiedName?: string;
};

const emptyConfig = (): WhatsAppConfig => ({
  token: FALLBACK_TOKEN,
  phoneNumberId: "",
  template: "hello_world",
  language: "en_US",
});

async function readConfig(): Promise<WhatsAppConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<WhatsAppConfig>;
    return {
      ...emptyConfig(),
      ...parsed,
      token: parsed.token || FALLBACK_TOKEN,
    };
  } catch {
    return emptyConfig();
  }
}

async function writeConfig(config: WhatsAppConfig) {
  await mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

function graphError(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "error" in body) {
    const err = (body as { error?: { message?: string; error_user_msg?: string } })
      .error;
    return err?.error_user_msg || err?.message || fallback;
  }
  return fallback;
}

async function graph<T>(
  token: string,
  pathname: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string; code?: number }> {
  const res = await fetch(`${GRAPH}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & {
    error?: { message?: string; code?: number; error_user_msg?: string };
  };
  if (!res.ok) {
    return {
      ok: false,
      error: graphError(data, `WhatsApp vrátil ${res.status}.`),
      code: data.error?.code,
    };
  }
  return { ok: true, data };
}

export async function getWhatsAppLine(): Promise<WhatsAppLine> {
  const config = await readConfig();
  if (!config.token || !config.phoneNumberId) {
    return {
      connected: false,
      from: config.displayPhone ?? "",
      paused: false,
      error:
        "Doplňte Phone Number ID a Cloud API token (začíná EAA) v Nastavení.",
    };
  }
  const result = await graph<{
    display_phone_number?: string;
    verified_name?: string;
  }>(
    config.token,
    `/${config.phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`,
  );
  if (!result.ok) {
    return {
      connected: false,
      from: config.displayPhone ?? "",
      paused: false,
      error: result.error.includes("Cannot parse")
        ? "Meta token nepřijala. Cloud API klíč začíná EAA, ne WAA."
        : result.error,
    };
  }
  const from = result.data.display_phone_number
    ? `+${result.data.display_phone_number.replace(/\D/g, "")}`
    : config.displayPhone ?? "";
  return {
    connected: true,
    from,
    paused: false,
    verifiedName: result.data.verified_name,
  };
}

export async function saveWhatsAppConfig(input: {
  token: string;
  phoneNumberId: string;
  template?: string;
  language?: string;
}) {
  const token = input.token.trim();
  const phoneNumberId = input.phoneNumberId.trim();
  if (!phoneNumberId) {
    throw new Error("Chybí Phone Number ID z Meta WhatsApp → API Setup.");
  }
  if (!token) throw new Error("Chybí Cloud API token.");
  if (token.startsWith("WAA") || token.startsWith("mlsn.")) {
    throw new Error(
      "Tohle není Meta Cloud API token. V App Dashboard → WhatsApp → API Setup vygenerujte token začínající EAA.",
    );
  }

  const result = await graph<{
    display_phone_number?: string;
    verified_name?: string;
  }>(
    token,
    `/${phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`,
  );
  if (!result.ok) {
    throw new Error(
      result.error.includes("Cannot parse")
        ? "Meta token nepřijala. Cloud API klíč začíná EAA."
        : result.error,
    );
  }

  const displayPhone = result.data.display_phone_number
    ? `+${result.data.display_phone_number.replace(/\D/g, "")}`
    : "";
  const config: WhatsAppConfig = {
    token,
    phoneNumberId,
    template: (input.template || "hello_world").trim() || "hello_world",
    language: (input.language || "en_US").trim() || "en_US",
    displayPhone,
    verifiedName: result.data.verified_name,
  };
  await writeConfig(config);
  return {
    connected: true as const,
    from: displayPhone,
    verifiedName: result.data.verified_name ?? "",
  };
}

function applyName(text: string, name?: string) {
  if (!name) return text.replaceAll("{{name}}", "");
  return text.replaceAll("{{name}}", name);
}

async function sendTemplate(
  token: string,
  phoneNumberId: string,
  to: string,
  template: string,
  language: string,
) {
  return graph<{ messages?: Array<{ id?: string }> }>(
    token,
    `/${phoneNumberId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: language },
        },
      }),
    },
  );
}

export async function dispatchWhatsApp(input: {
  to: string;
  text: string;
  name?: string;
}) {
  const config = await readConfig();
  if (!config.token || !config.phoneNumberId) {
    throw new Error("WhatsApp ještě není nastavený. Otevřete Nastavení.");
  }
  const to = input.to.replace(/\D/g, "");
  const body = applyName(input.text, input.name);

  const textResult = await graph<{ messages?: Array<{ id?: string }> }>(
    config.token,
    `/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body },
      }),
    },
  );

  let messageId = "";
  if (textResult.ok) {
    messageId = textResult.data.messages?.[0]?.id ?? "";
  } else if (
    textResult.code === 131047 ||
    textResult.code === 131026 ||
    /window|template|24/i.test(textResult.error)
  ) {
    const tpl = await sendTemplate(
      config.token,
      config.phoneNumberId,
      to,
      config.template,
      config.language,
    );
    if (!tpl.ok) {
      throw new Error(
        `${textResult.error} Šablona ${config.template}: ${tpl.error}`,
      );
    }
    messageId = tpl.data.messages?.[0]?.id ?? "";
  } else {
    throw new Error(textResult.error);
  }

  return {
    messageId,
    from: config.displayPhone || config.phoneNumberId,
    to: input.to,
    paused: false,
    statusCode: 200,
  };
}

export async function publicWhatsAppHint() {
  const config = await readConfig();
  return {
    phoneNumberId: config.phoneNumberId,
    template: config.template,
    language: config.language,
    hasToken: Boolean(config.token),
  };
}
