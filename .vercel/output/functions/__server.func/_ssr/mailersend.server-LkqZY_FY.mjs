import { n as FROM_NUMBER } from "./phone-osxGNV4O.mjs";
import { t as require_lib } from "../_libs/mailersend+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mailersend.server-LkqZY_FY.js
var import_lib = require_lib();
var API_KEY = process.env.MAILERSEND_API_KEY ?? "mlsn.321275360491054c9024d0fd91cdf2b9fe938eca70b6c2c0cc376800bb8de0a8";
function client() {
	return new import_lib.MailerSend({ apiKey: API_KEY });
}
async function getLineStatus() {
	const rows = (await client().sms.number.list({ limit: 10 })).body?.data ?? [];
	const match = rows.find((row) => row.telephone_number === "+18332562129") ?? rows[0];
	if (!match) return {
		connected: false,
		from: FROM_NUMBER,
		paused: false,
		error: "K tomuto účtu není připojené SMS číslo."
	};
	return {
		connected: true,
		from: match.telephone_number,
		paused: Boolean(match.paused)
	};
}
async function dispatchSms(input) {
	const from = (await getLineStatus()).from || "+18332562129";
	const smsParams = new import_lib.SMSParams().setFrom(from).setTo(input.to).setText(input.text);
	if (input.text.includes("{{name}}") && input.names) smsParams.setPersonalization(input.to.map((phone) => new import_lib.SMSPersonalization(phone, { name: input.names?.[phone] || phone })));
	const res = await client().sms.send(smsParams);
	const headers = res.headers ?? {};
	return {
		messageId: headers["x-sms-message-id"] ?? headers["X-SMS-Message-Id"] ?? "",
		from,
		to: input.to,
		paused: headers["x-sms-send-paused"] === "true",
		statusCode: res.statusCode
	};
}
function mapDeliveryStatus(raw) {
	const s = (raw ?? "").toLowerCase();
	if (s === "sent" || s === "delivered") return "sent";
	if (s === "processed") return "processed";
	if (s === "failed" || s === "rejected" || s === "undelivered" || s === "error") return "failed";
	if (s === "paused") return "paused";
	return "queued";
}
async function getSmsMessageStatus(messageId) {
	const data = (await client().sms.message.single(messageId)).body?.data;
	const sms = data?.sms?.[0];
	const activity = data?.sms_activity ?? [];
	const latest = activity[activity.length - 1];
	return {
		status: mapDeliveryStatus(latest?.status ?? sms?.status ?? (data?.paused ? "paused" : "queued")),
		error: sms?.error_description || void 0,
		segmentCount: typeof sms?.segment_count === "number" ? sms.segment_count : void 0
	};
}
async function listRecentMessages() {
	return ((await client().sms.message.list({ limit: 10 })).body?.data ?? []).filter((row) => row.id).map((row) => ({
		id: String(row.id),
		from: row.from ?? "",
		to: Array.isArray(row.to) ? row.to : [],
		text: row.text ?? "",
		paused: Boolean(row.paused),
		createdAt: row.created_at ?? ""
	}));
}
function parseMailerSendError(err) {
	if (err && typeof err === "object" && "body" in err) {
		const body = err.body;
		const details = body?.errors ? Object.values(body.errors).flat().filter(Boolean).join(" ") : "";
		if (details) return details;
		if (body?.message) return body.message;
		const status = err.statusCode;
		if (status) return `MailerSend vrátil ${status}.`;
	}
	if (err instanceof Error && err.message) return err.message;
	return "MailerSend zprávu neodeslal.";
}
//#endregion
export { dispatchSms, getLineStatus, getSmsMessageStatus, listRecentMessages, mapDeliveryStatus, parseMailerSendError };
