//#region node_modules/.nitro/vite/services/ssr/assets/phone-CwM1DhFV.js
/** MailerSend SMS number on this account — safe to show in the UI. */
var FROM_NUMBER = "+18332562129";
var SMS_MAX_CHARS = 2048;
var OUTBOX_KEY = "wire-outbox-v1";
var PEOPLE_KEY = "wire-people-v1";
var DRAFT_KEY = "wire-draft-v1";
var TEMPLATES_KEY = "wire-templates-v1";
var SETTINGS_KEY = "wire-settings-v1";
var copy = {
	studio: "SMS ateliér",
	tagline: (from) => `Odesíláte z ${from}. Koncepty a lidé zůstanou v tomto zařízení. Příjemci jen USA a Kanada.`,
	write: "Napsat zprávu",
	to: "Komu",
	toPlaceholder: "+1 415 555 0134, +1 212 555 0199",
	toHint: "Jedno nebo více čísel, oddělených čárkou. Jen USA a Kanada.",
	textThisLine: "Text na tuto linku",
	message: "Zpráva",
	messagePlaceholder: "Pište stručně. Pro jméno z Lidi použijte {{name}}.",
	insertName: "Vložit jméno",
	hello: "Ahoj",
	code: "Kód",
	reminder: "Připomínka",
	saveTemplate: "Uložit šablonu",
	send: "Odeslat SMS",
	sending: "Odesílám",
	sendN: (n) => n > 1 ? `Odeslat ${n} SMS` : "Odeslat SMS",
	confirmHint: "Před odesláním to ještě potvrdíte.",
	outbox: "Odchozí",
	clear: "Smazat",
	loading: "Načítám seznam…",
	emptyOutbox: "Zatím nic neodešlo. Po odeslání tady uvidíte stav a můžete ho obnovit z MailerSend.",
	search: "Hledat v odchozích",
	today: (msgs, segs) => `Dnes ${msgs} · ${segs} SMS`,
	resend: "Znovu",
	status: "Stav",
	copy: "Kopírovat",
	people: "Lidé",
	peopleTitle: "Lidé",
	peopleDesc: "Pojmenujte číslo v poli Komu. Pak stačí klepnout na jméno a vyplní se samo.",
	name: "Jméno",
	namePlaceholder: "Alex",
	savePerson: "Uložit osobu",
	noPeople: "Zatím tu nikdo není.",
	settings: "Nastavení",
	settingsDesc: "Podpis se připojí pod každou odeslanou zprávu.",
	signature: "Podpis",
	signaturePlaceholder: "— Wire",
	confirmToggle: "Před odesláním potvrdit",
	confirmTitle: "Odeslat tuto zprávu?",
	confirmBody: (who, segs, from) => `Komu ${who}. ${segs} SMS z ${from}.`,
	emptyMessage: "Prázdná zpráva",
	cancel: "Zrušit",
	sendNow: "Odeslat teď",
	templateTitle: "Název šablony",
	templatePlaceholder: "Např. Otevírací doba",
	save: "Uložit",
	max: "2048 max",
	smsCount: (n, enc) => `${n} SMS · ${enc}`,
	chars: (n) => `${n} znaků`,
	leftInSms: (left, n) => `zbývá ${left} v SMS ${n}`,
	removeBraces: "Odstraňte složené závorky, nebo použijte jen {{name}}.",
	live: "Živé",
	paused: "Pozastaveno",
	offline: "Offline",
	connecting: "Připojuji",
	queued: "Ve frontě",
	processed: "Zpracováno",
	sent: "Odesláno",
	failed: "Selhalo",
	pullHistory: "Načíst",
	loadedResend: "Připraveno k opětovnému odeslání",
	savedPerson: (name) => `Uloženo: ${name}`,
	savedTemplate: "Šablona uložena",
	copied: (label) => `${label} zkopírováno`,
	copyFail: "Nepodařilo se zkopírovat.",
	updated: (status) => `Aktualizováno: ${status}`,
	noId: "U této zprávy chybí ID z MailerSend.",
	offlineErr: "MailerSend je offline.",
	pausedErr: "Toto SMS číslo je pozastavené.",
	writeFirst: "Nejdřív napište zprávu.",
	validNumber: "Nejdřív zadejte platné číslo USA nebo Kanady.",
	giveName: "Dejte tomuto číslu jméno.",
	needNameToken: "Pro {{name}} uložte každého příjemce mezi Lidi.",
	refreshFail: "Stav se nepodařilo obnovit.",
	sendFail: "Odeslání selhalo.",
	historyFail: "Historii se nepodařilo načíst.",
	historyOk: (n) => n === 0 ? "Žádné nové zprávy." : `Načteno ${n} zpráv.`,
	close: "Zavřít",
	removePerson: (name) => `Odebrat ${name}`,
	clearOutbox: "Smazat odchozí",
	messageLabel: "Zpráva",
	helloBody: "Ahoj z Wire. Tohle je testovací zpráva.",
	codeBody: (code) => `Váš kód je ${code}. Platí 10 minut.`,
	reminderBody: "Připomínka: pořád to platí. Odpovězte, pokud to potřebujete přesunout.",
	invalidNumber: "Zadejte celé číslo s předvolbou.",
	usCaOnly: "MailerSend SMS doručuje jen do USA a Kanady.",
	tooMany: "Najednou lze oslovit nejvýš 8 čísel.",
	oneInvalid: "Některé číslo není v pořádku."
};
var statusLabel = {
	queued: copy.queued,
	processed: copy.processed,
	sent: copy.sent,
	failed: copy.failed,
	paused: copy.paused
};
/** Normalize user input to E.164. MailerSend SMS delivers to US and Canada only. */
function normalizeE164(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	let digits = trimmed.replace(/[^\d+]/g, "");
	if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
	if (digits.startsWith("+")) digits = `+${digits.slice(1).replace(/\D/g, "")}`;
	else {
		const only = digits.replace(/\D/g, "");
		if (only.length === 10) digits = `+1${only}`;
		else if (only.length === 11 && only.startsWith("1")) digits = `+${only}`;
		else if (only.length > 0) digits = `+${only}`;
		else return null;
	}
	if (!/^\+[1-9]\d{7,14}$/.test(digits)) return null;
	return digits;
}
function isUsOrCanada(e164) {
	return /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(e164);
}
function formatPretty(e164) {
	const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
	if (m) return `+1 ${m[1]} ${m[2]} ${m[3]}`;
	return e164;
}
function parseRecipients(raw) {
	const parts = raw.split(/[,;\n]+/).map((part) => part.trim()).filter(Boolean);
	const out = [];
	for (const part of parts) {
		const e164 = normalizeE164(part);
		if (e164 && !out.includes(e164)) out.push(e164);
	}
	return out;
}
function recipientsIssue(raw) {
	if (!raw.trim()) return null;
	const parts = raw.split(/[,;\n]+/).map((part) => part.trim()).filter(Boolean);
	if (parts.length > 8) return copy.tooMany;
	for (const part of parts) {
		const e164 = normalizeE164(part);
		if (!e164) return copy.invalidNumber;
		if (!isUsOrCanada(e164)) return copy.usCaOnly;
	}
	if (parseRecipients(raw).length === 0) return copy.oneInvalid;
	return null;
}
function nameTokensOk(text) {
	const stripped = text.replaceAll("{{name}}", "");
	return !/[{}]/.test(stripped);
}
//#endregion
export { SETTINGS_KEY as a, copy as c, nameTokensOk as d, normalizeE164 as f, statusLabel as h, PEOPLE_KEY as i, formatPretty as l, recipientsIssue as m, FROM_NUMBER as n, SMS_MAX_CHARS as o, parseRecipients as p, OUTBOX_KEY as r, TEMPLATES_KEY as s, DRAFT_KEY as t, isUsOrCanada as u };
