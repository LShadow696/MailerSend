import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { c as copy, d as nameTokensOk, f as normalizeE164, n as FROM_NUMBER, o as SMS_MAX_CHARS, u as isUsOrCanada } from "./phone-CwM1DhFV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D3wTAkvw.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getSmsLine_createServerFn_handler = createServerRpc({
	id: "96ec3b8789e858e2126cbb2ed21150d88c0d16735d90b6e7133649da9964eade",
	name: "getSmsLine",
	filename: "src/lib/sms/api.ts"
}, (opts) => getSmsLine.__executeServer(opts));
var getSmsLine = createServerFn({ method: "POST" }).handler(getSmsLine_createServerFn_handler, async () => {
	try {
		const { getLineStatus } = await import("./mailersend.server-ClAT5G38.mjs");
		return await getLineStatus();
	} catch (err) {
		const { parseMailerSendError } = await import("./mailersend.server-ClAT5G38.mjs");
		return {
			connected: false,
			from: FROM_NUMBER,
			paused: false,
			error: parseMailerSendError(err)
		};
	}
});
var sendSms_createServerFn_handler = createServerRpc({
	id: "ee3677e6481da28e76736a82b0e0330a8a964c310e2bdc53cd85e647f5911192",
	name: "sendSms",
	filename: "src/lib/sms/api.ts"
}, (opts) => sendSms.__executeServer(opts));
var sendSms = createServerFn({ method: "POST" }).validator((input) => {
	const to = (input.to ?? []).map((value) => normalizeE164(value)).filter((value) => Boolean(value));
	const unique = [...new Set(to)];
	if (unique.length === 0) throw new Error(copy.invalidNumber);
	if (unique.length > 8) throw new Error(copy.tooMany);
	if (unique.some((n) => !isUsOrCanada(n))) throw new Error(copy.usCaOnly);
	const text = input.text.trim();
	if (!text) throw new Error(copy.writeFirst);
	if (text.length > 2048) throw new Error(`Zpráva může mít nejvýš ${SMS_MAX_CHARS} znaků.`);
	if (!nameTokensOk(text)) throw new Error(copy.removeBraces);
	if (text.includes("{{name}}")) {
		if (unique.filter((n) => !input.names?.[n]).length) throw new Error(copy.needNameToken);
	}
	return {
		to: unique,
		text,
		names: input.names ?? {}
	};
}).handler(sendSms_createServerFn_handler, async ({ data }) => {
	const { dispatchSms, parseMailerSendError } = await import("./mailersend.server-ClAT5G38.mjs");
	try {
		return {
			ok: true,
			...await dispatchSms(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: parseMailerSendError(err)
		};
	}
});
var getSmsStatus_createServerFn_handler = createServerRpc({
	id: "990da3b7efcb46ec8182164ded41b63bf6d8e213dac94ccc72596ae0108e1ed4",
	name: "getSmsStatus",
	filename: "src/lib/sms/api.ts"
}, (opts) => getSmsStatus.__executeServer(opts));
var getSmsStatus = createServerFn({ method: "POST" }).validator((input) => {
	const messageId = input.messageId.trim();
	if (!messageId) throw new Error(copy.noId);
	return { messageId };
}).handler(getSmsStatus_createServerFn_handler, async ({ data }) => {
	const { getSmsMessageStatus, parseMailerSendError } = await import("./mailersend.server-ClAT5G38.mjs");
	try {
		return {
			ok: true,
			...await getSmsMessageStatus(data.messageId)
		};
	} catch (err) {
		return {
			ok: false,
			error: parseMailerSendError(err)
		};
	}
});
var listSmsHistory_createServerFn_handler = createServerRpc({
	id: "680f6a3da398cda4995dac6f11c67071d993bd76a1ca0c7c3f1c31c874c13702",
	name: "listSmsHistory",
	filename: "src/lib/sms/api.ts"
}, (opts) => listSmsHistory.__executeServer(opts));
var listSmsHistory = createServerFn({ method: "POST" }).handler(listSmsHistory_createServerFn_handler, async () => {
	const { listRecentMessages, parseMailerSendError } = await import("./mailersend.server-ClAT5G38.mjs");
	try {
		return {
			ok: true,
			messages: await listRecentMessages()
		};
	} catch (err) {
		return {
			ok: false,
			error: parseMailerSendError(err)
		};
	}
});
//#endregion
export { getSmsLine_createServerFn_handler, getSmsStatus_createServerFn_handler, listSmsHistory_createServerFn_handler, sendSms_createServerFn_handler };
