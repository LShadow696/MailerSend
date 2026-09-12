import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { d as isUsOrCanada, f as nameTokensOk, l as copy, n as FROM_NUMBER, p as normalizeE164, s as SMS_MAX_CHARS } from "./phone-osxGNV4O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D0oJRB5V.js
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
		const { getLineStatus } = await import("./mailersend.server-LkqZY_FY.mjs");
		return await getLineStatus();
	} catch (err) {
		const { parseMailerSendError } = await import("./mailersend.server-LkqZY_FY.mjs");
		return {
			connected: false,
			from: FROM_NUMBER,
			paused: false,
			error: parseMailerSendError(err)
		};
	}
});
var getChannelStatus_createServerFn_handler = createServerRpc({
	id: "885945b256a86e98dccf12748c4f52b723de14f37275c71c8973176c507ff9fe",
	name: "getChannelStatus",
	filename: "src/lib/sms/api.ts"
}, (opts) => getChannelStatus.__executeServer(opts));
var getChannelStatus = createServerFn({ method: "POST" }).handler(getChannelStatus_createServerFn_handler, async () => {
	const [{ getLineStatus, parseMailerSendError }, sendblue, whatsapp] = await Promise.all([
		import("./mailersend.server-LkqZY_FY.mjs"),
		import("./sendblue.server-BtR2NDAp.mjs"),
		import("./whatsapp.server-AIiYEaod.mjs")
	]);
	const [sms, imessage, wa] = await Promise.all([
		getLineStatus().catch((err) => ({
			connected: false,
			from: FROM_NUMBER,
			paused: false,
			error: parseMailerSendError(err)
		})),
		sendblue.getSendblueLine(),
		whatsapp.getWhatsAppLine()
	]);
	let contacts = [];
	try {
		contacts = await sendblue.listSendblueContacts();
	} catch {
		contacts = [];
	}
	return {
		sms,
		imessage,
		whatsapp: wa,
		contacts
	};
});
var sendSms_createServerFn_handler = createServerRpc({
	id: "ee3677e6481da28e76736a82b0e0330a8a964c310e2bdc53cd85e647f5911192",
	name: "sendSms",
	filename: "src/lib/sms/api.ts"
}, (opts) => sendSms.__executeServer(opts));
var sendSms = createServerFn({ method: "POST" }).validator((input) => {
	const channel = input.channel === "imessage" ? "imessage" : input.channel === "whatsapp" ? "whatsapp" : "sms";
	const to = (input.to ?? []).map((value) => normalizeE164(value)).filter((value) => Boolean(value));
	const unique = [...new Set(to)];
	if (unique.length === 0) throw new Error(copy.invalidNumber);
	if (unique.length > 8) throw new Error(copy.tooMany);
	if (channel === "sms" && unique.some((n) => !isUsOrCanada(n))) throw new Error(copy.usCaOnly);
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
		names: input.names ?? {},
		channel
	};
}).handler(sendSms_createServerFn_handler, async ({ data }) => {
	if (data.channel === "imessage") {
		const { dispatchIMessage } = await import("./sendblue.server-BtR2NDAp.mjs");
		const results = [];
		for (const to of data.to) try {
			const result = await dispatchIMessage({
				to,
				text: data.text,
				name: data.names[to]
			});
			results.push({
				ok: true,
				...result
			});
		} catch (err) {
			results.push({
				ok: false,
				to,
				error: err instanceof Error ? err.message : "Sendblue zprávu neodeslal."
			});
		}
		const firstOk = results.find((row) => row.ok);
		const firstFail = results.find((row) => !row.ok);
		if (firstOk && firstOk.ok) return {
			ok: true,
			messageId: firstOk.messageId,
			from: firstOk.from,
			to: data.to,
			paused: false,
			channel: "imessage",
			errors: firstFail && !firstFail.ok ? firstFail.error : void 0
		};
		return {
			ok: false,
			error: firstFail && !firstFail.ok ? firstFail.error : "Sendblue zprávu neodeslal."
		};
	}
	if (data.channel === "whatsapp") {
		const { dispatchWhatsApp } = await import("./whatsapp.server-AIiYEaod.mjs");
		const results = [];
		for (const to of data.to) try {
			const result = await dispatchWhatsApp({
				to,
				text: data.text,
				name: data.names[to]
			});
			results.push({
				ok: true,
				...result
			});
		} catch (err) {
			results.push({
				ok: false,
				to,
				error: err instanceof Error ? err.message : "WhatsApp zprávu neodeslal."
			});
		}
		const firstOk = results.find((row) => row.ok);
		const firstFail = results.find((row) => !row.ok);
		if (firstOk && firstOk.ok) return {
			ok: true,
			messageId: firstOk.messageId,
			from: firstOk.from,
			to: data.to,
			paused: false,
			channel: "whatsapp",
			errors: firstFail && !firstFail.ok ? firstFail.error : void 0
		};
		return {
			ok: false,
			error: firstFail && !firstFail.ok ? firstFail.error : "WhatsApp zprávu neodeslal."
		};
	}
	const { dispatchSms, parseMailerSendError } = await import("./mailersend.server-LkqZY_FY.mjs");
	try {
		return {
			ok: true,
			channel: "sms",
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
	return {
		messageId,
		channel: input.channel === "imessage" ? "imessage" : input.channel === "whatsapp" ? "whatsapp" : "sms"
	};
}).handler(getSmsStatus_createServerFn_handler, async ({ data }) => {
	if (data.channel === "whatsapp") return {
		ok: true,
		status: "queued",
		error: void 0,
		segmentCount: void 0
	};
	if (data.channel === "imessage") try {
		const { getSendblueMessageStatus } = await import("./sendblue.server-BtR2NDAp.mjs");
		return {
			ok: true,
			...await getSendblueMessageStatus(data.messageId)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : copy.refreshFail
		};
	}
	const { getSmsMessageStatus, parseMailerSendError } = await import("./mailersend.server-LkqZY_FY.mjs");
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
var lookupService_createServerFn_handler = createServerRpc({
	id: "dd9752b7e554654d1b8d4dbc8d199c1f1bbaddc8973e8d0356042d0ac05b3b31",
	name: "lookupService",
	filename: "src/lib/sms/api.ts"
}, (opts) => lookupService.__executeServer(opts));
var lookupService = createServerFn({ method: "POST" }).validator((input) => {
	const number = normalizeE164(input.number);
	if (!number) throw new Error(copy.invalidNumber);
	return { number };
}).handler(lookupService_createServerFn_handler, async ({ data }) => {
	try {
		const { evaluateService } = await import("./sendblue.server-BtR2NDAp.mjs");
		return {
			ok: true,
			...await evaluateService(data.number)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Službu se nepodařilo zjistit."
		};
	}
});
var listSmsHistory_createServerFn_handler = createServerRpc({
	id: "680f6a3da398cda4995dac6f11c67071d993bd76a1ca0c7c3f1c31c874c13702",
	name: "listSmsHistory",
	filename: "src/lib/sms/api.ts"
}, (opts) => listSmsHistory.__executeServer(opts));
var listSmsHistory = createServerFn({ method: "POST" }).handler(listSmsHistory_createServerFn_handler, async () => {
	const mailer = await import("./mailersend.server-LkqZY_FY.mjs");
	const blue = await import("./sendblue.server-BtR2NDAp.mjs");
	const [sms, imessage] = await Promise.all([mailer.listRecentMessages().then((messages) => ({
		ok: true,
		messages
	}), (err) => ({
		ok: false,
		error: mailer.parseMailerSendError(err),
		messages: []
	})), blue.listSendblueMessages().then((messages) => ({
		ok: true,
		messages
	}), (err) => ({
		ok: false,
		error: err instanceof Error ? err.message : copy.historyFail,
		messages: []
	}))]);
	return {
		sms,
		imessage
	};
});
var saveWhatsApp_createServerFn_handler = createServerRpc({
	id: "a87e7ab35b71444b1555609b6ce6be0697995b096c78e4b37dd7e33214385f46",
	name: "saveWhatsApp",
	filename: "src/lib/sms/api.ts"
}, (opts) => saveWhatsApp.__executeServer(opts));
var saveWhatsApp = createServerFn({ method: "POST" }).validator((input) => ({
	token: String(input.token ?? "").trim(),
	phoneNumberId: String(input.phoneNumberId ?? "").trim(),
	template: String(input.template ?? "hello_world").trim() || "hello_world",
	language: String(input.language ?? "en_US").trim() || "en_US"
})).handler(saveWhatsApp_createServerFn_handler, async ({ data }) => {
	const { saveWhatsAppConfig } = await import("./whatsapp.server-AIiYEaod.mjs");
	try {
		return {
			ok: true,
			...await saveWhatsAppConfig(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "WhatsApp se nepodařilo ověřit."
		};
	}
});
//#endregion
export { getChannelStatus_createServerFn_handler, getSmsLine_createServerFn_handler, getSmsStatus_createServerFn_handler, listSmsHistory_createServerFn_handler, lookupService_createServerFn_handler, saveWhatsApp_createServerFn_handler, sendSms_createServerFn_handler };
