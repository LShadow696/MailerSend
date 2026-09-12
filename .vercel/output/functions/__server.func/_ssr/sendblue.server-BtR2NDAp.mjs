//#region node_modules/.nitro/vite/services/ssr/assets/sendblue.server-BtR2NDAp.js
var API_KEY = process.env.SENDBLUE_API_KEY ?? "39992f0c244afc9ce2089556633c6c4b";
var API_SECRET = process.env.SENDBLUE_API_SECRET ?? "85cfa18ebb1a03459b73284ad35adb66";
var SENDBLUE_FROM = "+19176257748";
async function sendblue(path, init) {
	const res = await fetch(`https://api.sendblue.co${path}`, {
		...init,
		headers: {
			"sb-api-key-id": API_KEY,
			"sb-api-secret-key": API_SECRET,
			"Content-Type": "application/json",
			Accept: "application/json",
			...init?.headers ?? {}
		}
	});
	const text = await res.text();
	let body = {};
	try {
		body = text ? JSON.parse(text) : {};
	} catch {
		body = { message: text };
	}
	if (!res.ok) {
		const err = body;
		throw new Error(err.error_message || err.message || `Sendblue vrátil ${res.status}.`);
	}
	return body;
}
async function getSendblueLine() {
	try {
		const row = (await sendblue("/api/v2/lines/state")).data?.[0];
		const from = row?.sendblue_number || "+19176257748";
		const online = (row?.status ?? "").toUpperCase() === "ONLINE";
		return {
			connected: online,
			from,
			paused: !online,
			status: row?.status,
			error: online ? void 0 : "Sendblue linka není online."
		};
	} catch (err) {
		return {
			connected: false,
			from: SENDBLUE_FROM,
			paused: false,
			error: err instanceof Error ? err.message : "Sendblue je offline."
		};
	}
}
async function evaluateService(number) {
	const res = await sendblue(`/api/evaluate-service?number=${encodeURIComponent(number)}`);
	const raw = (res.service ?? "SMS").toLowerCase();
	const service = raw === "imessage" ? "iMessage" : raw === "rcs" ? "RCS" : "SMS";
	return {
		number: res.number ?? number,
		service
	};
}
function applyName(text, name) {
	if (!name) return text.replaceAll("{{name}}", "");
	return text.replaceAll("{{name}}", name);
}
async function dispatchIMessage(input) {
	const from = (await getSendblueLine()).from || "+19176257748";
	const content = applyName(input.text, input.name);
	const res = await sendblue("/api/send-message", {
		method: "POST",
		body: JSON.stringify({
			from_number: from,
			number: input.to,
			content
		})
	});
	if ((res.status ?? "QUEUED").toUpperCase() === "ERROR" || res.error_message) throw new Error(res.error_message || "Sendblue zprávu neodeslal.");
	return {
		messageId: res.message_handle ?? "",
		from,
		to: input.to,
		service: res.service ?? "iMessage",
		paused: false,
		statusCode: 200
	};
}
async function getSendblueMessageStatus(messageId) {
	const row = (await sendblue(`/api/v2/messages/${encodeURIComponent(messageId)}`)).data ?? {};
	const raw = (row.status ?? "QUEUED").toUpperCase();
	return {
		status: raw === "DELIVERED" || raw === "RECEIVED" ? "sent" : raw === "SENT" ? "processed" : raw === "ERROR" || raw === "FAILED" ? "failed" : "queued",
		error: row.error_message || void 0,
		service: row.service,
		segmentCount: void 0
	};
}
async function listSendblueMessages() {
	return ((await sendblue("/api/v2/messages?limit=10&is_outbound=true")).data ?? []).filter((row) => row.message_handle && row.is_outbound !== false).map((row) => ({
		id: String(row.message_handle),
		from: row.from_number ?? "",
		to: row.to_number ?? "",
		text: row.content ?? "",
		status: row.status ?? "QUEUED",
		service: row.service ?? "iMessage",
		createdAt: row.date_sent ?? ""
	}));
}
async function listSendblueContacts() {
	const rows = await sendblue("/api/v2/contacts?limit=16");
	return (Array.isArray(rows) ? rows : []).filter((row) => row.phone).map((row) => {
		return {
			name: `${row.first_name || row.firstName || ""} ${row.last_name || row.lastName || ""}`.trim() || row.phone || "",
			phone: row.phone || ""
		};
	});
}
//#endregion
export { SENDBLUE_FROM, dispatchIMessage, evaluateService, getSendblueLine, getSendblueMessageStatus, listSendblueContacts, listSendblueMessages };
