import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp.server-AIiYEaod.js
var CONFIG_PATH = path.join(process.cwd(), ".data", "whatsapp.json");
var GRAPH = "https://graph.facebook.com/v22.0";
var FALLBACK_TOKEN = process.env.WHATSAPP_API_KEY ?? "";
var emptyConfig = () => ({
	token: FALLBACK_TOKEN,
	phoneNumberId: "",
	template: "hello_world",
	language: "en_US"
});
async function readConfig() {
	try {
		const raw = await readFile(CONFIG_PATH, "utf8");
		const parsed = JSON.parse(raw);
		return {
			...emptyConfig(),
			...parsed,
			token: parsed.token || FALLBACK_TOKEN
		};
	} catch {
		return emptyConfig();
	}
}
async function writeConfig(config) {
	await mkdir(path.dirname(CONFIG_PATH), { recursive: true });
	await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}
function graphError(body, fallback) {
	if (body && typeof body === "object" && "error" in body) {
		const err = body.error;
		return err?.error_user_msg || err?.message || fallback;
	}
	return fallback;
}
async function graph(token, pathname, init) {
	const res = await fetch(`${GRAPH}${pathname}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			...init?.headers ?? {}
		}
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) return {
		ok: false,
		error: graphError(data, `WhatsApp vrátil ${res.status}.`),
		code: data.error?.code
	};
	return {
		ok: true,
		data
	};
}
async function getWhatsAppLine() {
	const config = await readConfig();
	if (!config.token || !config.phoneNumberId) return {
		connected: false,
		from: config.displayPhone ?? "",
		paused: false,
		error: "Doplňte Phone Number ID a Cloud API token (začíná EAA) v Nastavení."
	};
	const result = await graph(config.token, `/${config.phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`);
	if (!result.ok) return {
		connected: false,
		from: config.displayPhone ?? "",
		paused: false,
		error: result.error.includes("Cannot parse") ? "Meta token nepřijala. Cloud API klíč začíná EAA, ne WAA." : result.error
	};
	return {
		connected: true,
		from: result.data.display_phone_number ? `+${result.data.display_phone_number.replace(/\D/g, "")}` : config.displayPhone ?? "",
		paused: false,
		verifiedName: result.data.verified_name
	};
}
async function saveWhatsAppConfig(input) {
	const token = input.token.trim();
	const phoneNumberId = input.phoneNumberId.trim();
	if (!phoneNumberId) throw new Error("Chybí Phone Number ID z Meta WhatsApp → API Setup.");
	if (!token) throw new Error("Chybí Cloud API token.");
	if (token.startsWith("WAA") || token.startsWith("mlsn.")) throw new Error("Tohle není Meta Cloud API token. V App Dashboard → WhatsApp → API Setup vygenerujte token začínající EAA.");
	const result = await graph(token, `/${phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`);
	if (!result.ok) throw new Error(result.error.includes("Cannot parse") ? "Meta token nepřijala. Cloud API klíč začíná EAA." : result.error);
	const displayPhone = result.data.display_phone_number ? `+${result.data.display_phone_number.replace(/\D/g, "")}` : "";
	await writeConfig({
		token,
		phoneNumberId,
		template: (input.template || "hello_world").trim() || "hello_world",
		language: (input.language || "en_US").trim() || "en_US",
		displayPhone,
		verifiedName: result.data.verified_name
	});
	return {
		connected: true,
		from: displayPhone,
		verifiedName: result.data.verified_name ?? ""
	};
}
function applyName(text, name) {
	if (!name) return text.replaceAll("{{name}}", "");
	return text.replaceAll("{{name}}", name);
}
async function sendTemplate(token, phoneNumberId, to, template, language) {
	return graph(token, `/${phoneNumberId}/messages`, {
		method: "POST",
		body: JSON.stringify({
			messaging_product: "whatsapp",
			recipient_type: "individual",
			to,
			type: "template",
			template: {
				name: template,
				language: { code: language }
			}
		})
	});
}
async function dispatchWhatsApp(input) {
	const config = await readConfig();
	if (!config.token || !config.phoneNumberId) throw new Error("WhatsApp ještě není nastavený. Otevřete Nastavení.");
	const to = input.to.replace(/\D/g, "");
	const body = applyName(input.text, input.name);
	const textResult = await graph(config.token, `/${config.phoneNumberId}/messages`, {
		method: "POST",
		body: JSON.stringify({
			messaging_product: "whatsapp",
			recipient_type: "individual",
			to,
			type: "text",
			text: {
				preview_url: false,
				body
			}
		})
	});
	let messageId = "";
	if (textResult.ok) messageId = textResult.data.messages?.[0]?.id ?? "";
	else if (textResult.code === 131047 || textResult.code === 131026 || /window|template|24/i.test(textResult.error)) {
		const tpl = await sendTemplate(config.token, config.phoneNumberId, to, config.template, config.language);
		if (!tpl.ok) throw new Error(`${textResult.error} Šablona ${config.template}: ${tpl.error}`);
		messageId = tpl.data.messages?.[0]?.id ?? "";
	} else throw new Error(textResult.error);
	return {
		messageId,
		from: config.displayPhone || config.phoneNumberId,
		to: input.to,
		paused: false,
		statusCode: 200
	};
}
async function publicWhatsAppHint() {
	const config = await readConfig();
	return {
		phoneNumberId: config.phoneNumberId,
		template: config.template,
		language: config.language,
		hasToken: Boolean(config.token)
	};
}
//#endregion
export { dispatchWhatsApp, getWhatsAppLine, publicWhatsAppHint, saveWhatsAppConfig };
