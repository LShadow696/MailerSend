import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, _ as Slot, a as Overlay2, c as Title2, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, i as Description2, l as Dialog$1, m as DialogPortal$1, n as Cancel, o as Portal2, p as DialogOverlay$1, r as Content2, s as Root2, t as Action, u as DialogClose, w as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as PEOPLE_KEY, c as TEMPLATES_KEY, f as nameTokensOk, g as statusLabel, h as recipientsIssue, i as OUTBOX_KEY, l as copy, m as parseRecipients, n as FROM_NUMBER, o as SETTINGS_KEY, r as IMESSAGE_FROM, s as SMS_MAX_CHARS, t as DRAFT_KEY, u as formatPretty } from "./phone-osxGNV4O.mjs";
import { a as Settings, c as Plus, d as Copy, f as BookmarkPlus, i as Trash2, l as LoaderCircle, n as UserPlus, o as RotateCcw, p as ArrowUpRight, s as RefreshCw, t as X, u as History } from "../_libs/lucide-react.mjs";
import { a as listSmsHistory, c as sendSms, i as getSmsStatus, l as FALLBACK, n as Route, o as lookupService, r as getChannelStatus, s as saveWhatsApp } from "./router-2Q6k1XFd.mjs";
import { n as formatDistanceToNow, r as startOfDay, t as cs } from "../_libs/date-fns.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ClqOxc0a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var channels = [
	{
		id: "imessage",
		name: "iMessage",
		status: "live",
		summary: "Sendblue · +1 917 625 7748",
		detail: "Linka je online. Sendblue pošle modrou bublinu, když to číslo iMessage umí. Jinak spadne na RCS nebo SMS. Už jste ověřili české číslo na této lince.",
		needs: "Nic dalšího. Klíč je na serveru, číslo +1 917 625 7748 je připojené."
	},
	{
		id: "sms",
		name: "SMS",
		status: "live",
		summary: "MailerSend · USA a Kanada",
		detail: "Toll-free +1 833 256 2129 pořád posílá přes MailerSend. Jen USA a Kanada. Pro Česko použijte iMessage.",
		needs: "Nic dalšího. MailerSend klíč a číslo jsou připojené."
	},
	{
		id: "whatsapp",
		name: "WhatsApp",
		status: "provision",
		summary: "Nastavte Cloud API v Nastavení",
		detail: "MailerSend WhatsApp endpoint existuje, ale váš token nemá oprávnění (403). Dřívější klíč WAA Meta Graph API nepřijala. Potřebujete: 1) Meta Business + WABA, 2) ověřené číslo, 3) Phone Number ID, 4) systémový token začínající EAA. Volný text na nový kontakt nejde — Meta chce schválenou šablonu.",
		needs: "Phone Number ID a token EAA z developers.facebook.com → WhatsApp → API Setup."
	},
	{
		id: "rcs",
		name: "RCS",
		status: "partner",
		summary: "Přes Sendblue na Android",
		detail: "Samostatný firemní RCS agent (logo, karty, ověřený odesílatel) tu není. Sendblue ale na Androidu zkusí RCS a jinak SMS. To není totéž jako Google RBM.",
		needs: "Pro branded RCS: Twilio, Sinch nebo Infobip a ověřený agent."
	},
	{
		id: "telegram",
		name: "Telegram",
		status: "partner",
		summary: "Oficiální Bot API, zdarma",
		detail: "Telegram Bot API je veřejné a v Česku běžné. Příjemce musí bota nejdřív spustit.",
		needs: "Token od BotFather."
	}
];
var GSM_BASIC = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
var GSM_EXT = "^{}\\[~]|€";
function gsmUnits(text) {
	let units = 0;
	for (const ch of text) if (GSM_EXT.includes(ch)) units += 2;
	else if (GSM_BASIC.includes(ch)) units += 1;
	else return -1;
	return units;
}
function analyzeMessage(text) {
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
		hasBraces
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("btn-tap inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-opacity duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-border hover:opacity-90",
			secondary: "bg-surface-2 text-foreground shadow-border hover:bg-muted",
			ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
			outline: "bg-transparent text-foreground shadow-border hover:bg-surface-2"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function AlertDialog(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		"data-slot": "alert-dialog",
		...props
	});
}
function AlertDialogPortal(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, {
		"data-slot": "alert-dialog-portal",
		...props
	});
}
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
		"data-slot": "alert-dialog-overlay",
		className: cn("fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		"data-slot": "alert-dialog-content",
		className: cn("fixed inset-x-5 top-1/2 z-50 mx-auto w-auto max-w-md -translate-y-1/2 rounded-2xl bg-card p-5 text-card-foreground shadow-border", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-2 text-left", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("font-display text-2xl italic tracking-tight text-foreground", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("text-sm leading-relaxed text-muted-foreground", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants(), "h-11", className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), "h-11", className),
		...props
	});
}
var badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide", {
	variants: { variant: {
		live: "bg-ok/15 text-ok",
		muted: "bg-muted text-muted-foreground",
		warn: "bg-bad/15 text-bad",
		queued: "bg-accent/15 text-accent"
	} },
	defaultVariants: { variant: "muted" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Dialog(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		"data-slot": "dialog",
		...props
	});
}
function DialogPortal(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal$1, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		"data-slot": "dialog-overlay",
		className: cn("fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		"data-slot": "dialog-content",
		className: cn("fixed inset-x-5 top-1/2 z-50 mx-auto w-auto max-w-md -translate-y-1/2 rounded-2xl bg-card p-5 text-card-foreground shadow-border", "max-h-[min(90dvh,42rem)] overflow-y-auto", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute top-3 right-3 grid size-11 place-items-center rounded-md text-muted-foreground hover:text-foreground",
			"aria-label": "Zavřít",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-2 pr-10", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-2xl italic tracking-tight text-foreground", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm leading-relaxed text-muted-foreground", className),
		...props
	});
}
function Input({ className, type = "text", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("flex h-12 w-full rounded-md bg-surface-2 px-4 text-base text-foreground shadow-border", "placeholder:text-subtle", "transition-shadow duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-50", "font-mono tracking-wide", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "label",
		className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function Separator({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		"aria-orientation": orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		"data-slot": "switch",
		className: cn("peer inline-flex h-7 w-11 shrink-0 items-center rounded-full shadow-border transition-colors", "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-40", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, {
			"data-slot": "switch-thumb",
			className: cn("pointer-events-none block size-5 rounded-full bg-foreground shadow-border transition-transform", "data-[state=checked]:translate-x-5 data-[state=checked]:bg-primary-foreground", "data-[state=unchecked]:translate-x-0.5")
		})
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex min-h-40 w-full resize-y rounded-md bg-surface-2 px-4 py-3 text-base leading-relaxed text-foreground shadow-border", "placeholder:text-subtle", "transition-shadow duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function readJson(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function sixDigitCode() {
	return (crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0] % 1e6).toString().padStart(6, "0");
}
function composeBody(text, signature) {
	const body = text.trim();
	const sig = signature.trim();
	if (!sig || body.endsWith(sig)) return body;
	return `${body}\n${sig}`;
}
var FALLBACK_LINES = {
	sms: {
		connected: false,
		from: FROM_NUMBER,
		paused: false
	},
	imessage: {
		connected: false,
		from: IMESSAGE_FROM,
		paused: false
	},
	whatsapp: {
		connected: false,
		from: "",
		paused: false
	},
	contacts: []
};
var DEFAULT_SETTINGS = {
	signature: "",
	confirm: true
};
function SmsStudio({ initial }) {
	const seed = initial ?? FALLBACK_LINES;
	const [smsLine, setSmsLine] = (0, import_react.useState)(seed.sms);
	const [imessageLine, setImessageLine] = (0, import_react.useState)(seed.imessage);
	const [whatsappLine, setWhatsappLine] = (0, import_react.useState)(seed.whatsapp);
	const [sendMode, setSendMode] = (0, import_react.useState)("imessage");
	const [to, setTo] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(false);
	const [outbox, setOutbox] = (0, import_react.useState)([]);
	const [people, setPeople] = (0, import_react.useState)(() => (seed.contacts ?? []).map((row) => ({
		id: row.phone,
		name: row.name,
		phone: row.phone
	})));
	const [templates, setTemplates] = (0, import_react.useState)([]);
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(false);
	const [peopleOpen, setPeopleOpen] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [templateOpen, setTemplateOpen] = (0, import_react.useState)(false);
	const [personName, setPersonName] = (0, import_react.useState)("");
	const [templateTitle, setTemplateTitle] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [channelId, setChannelId] = (0, import_react.useState)(null);
	const [checkingId, setCheckingId] = (0, import_react.useState)(null);
	const [pulling, setPulling] = (0, import_react.useState)(false);
	const [lookup, setLookup] = (0, import_react.useState)(null);
	const [waPhoneId, setWaPhoneId] = (0, import_react.useState)("");
	const [waToken, setWaToken] = (0, import_react.useState)("");
	const [waTemplate, setWaTemplate] = (0, import_react.useState)("hello_world");
	const [waConnecting, setWaConnecting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const draft = readJson(DRAFT_KEY, {});
		setTo(typeof draft.to === "string" ? draft.to : "");
		setText(typeof draft.text === "string" ? draft.text : "");
		if (draft.channel === "sms" || draft.channel === "imessage" || draft.channel === "whatsapp") setSendMode(draft.channel);
		const storedOutbox = readJson(OUTBOX_KEY, []);
		setOutbox(Array.isArray(storedOutbox) ? storedOutbox : []);
		const storedPeople = readJson(PEOPLE_KEY, []);
		if (Array.isArray(storedPeople) && storedPeople.length) setPeople((prev) => {
			const have = new Set(storedPeople.map((person) => person.phone));
			const extra = prev.filter((person) => !have.has(person.phone));
			return [...storedPeople, ...extra].slice(0, 16);
		});
		const storedTemplates = readJson(TEMPLATES_KEY, []);
		setTemplates(Array.isArray(storedTemplates) ? storedTemplates : []);
		const storedSettings = readJson(SETTINGS_KEY, DEFAULT_SETTINGS);
		setSettings({
			signature: typeof storedSettings.signature === "string" ? storedSettings.signature : "",
			confirm: storedSettings.confirm !== false
		});
		setHydrated(true);
		let cancelled = false;
		getChannelStatus().then((status) => {
			if (cancelled) return;
			setSmsLine(status.sms);
			setImessageLine(status.imessage);
			setWhatsappLine(status.whatsapp);
			if (status.contacts.length) setPeople((prev) => {
				const have = new Set(prev.map((person) => person.phone));
				const extra = status.contacts.filter((row) => row.phone && !have.has(row.phone)).map((row) => ({
					id: crypto.randomUUID(),
					name: row.name,
					phone: row.phone
				}));
				return [...prev, ...extra].slice(0, 16);
			});
		}).catch(() => {
			if (!cancelled) setSmsLine((prev) => prev.connected ? prev : {
				...prev,
				error: copy.offlineErr
			});
		});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox.slice(0, 40)));
	}, [hydrated, outbox]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(PEOPLE_KEY, JSON.stringify(people.slice(0, 16)));
	}, [hydrated, people]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates.slice(0, 12)));
	}, [hydrated, templates]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	}, [hydrated, settings]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(DRAFT_KEY, JSON.stringify({
			to,
			text,
			channel: sendMode
		}));
	}, [
		hydrated,
		to,
		text,
		sendMode
	]);
	const line = sendMode === "imessage" ? imessageLine : sendMode === "whatsapp" ? whatsappLine : smsLine;
	const from = line.from || (sendMode === "imessage" ? "+19176257748" : sendMode === "whatsapp" ? "" : "+18332562129");
	const issue = recipientsIssue(to, sendMode);
	const recipients = parseRecipients(to);
	const primary = recipients[0] ?? null;
	const info = (0, import_react.useMemo)(() => analyzeMessage(composeBody(text, settings.signature)), [text, settings.signature]);
	const known = people.find((person) => person.phone === primary);
	const names = (0, import_react.useMemo)(() => {
		const map = {};
		for (const person of people) map[person.phone] = person.name;
		return map;
	}, [people]);
	const recents = (0, import_react.useMemo)(() => {
		const seen = new Set(people.map((person) => person.phone));
		const list = [];
		for (const item of outbox) {
			const nums = item.recipients?.length ? item.recipients : [item.to];
			for (const phone of nums) {
				if (seen.has(phone)) continue;
				seen.add(phone);
				list.push(phone);
				if (list.length >= 4) return list;
			}
		}
		return list;
	}, [outbox, people]);
	const nameReady = !text.includes("{{name}}") || recipients.every((phone) => Boolean(names[phone]));
	const canSend = recipients.length > 0 && !issue && text.trim().length > 0 && !info.overLimit && nameTokensOk(text) && nameReady && !sending && line.connected && !line.paused;
	(0, import_react.useEffect)(() => {
		if (!primary || issue) {
			setLookup(null);
			return;
		}
		let cancelled = false;
		const timer = window.setTimeout(() => {
			lookupService({ data: { number: primary } }).then((result) => {
				if (!cancelled && result.ok) setLookup(result.service);
			}).catch(() => {
				if (!cancelled) setLookup(null);
			});
		}, 280);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [primary, issue]);
	const usedInSegment = info.segments === 0 ? 0 : info.perSegment - info.remaining;
	const meterPct = info.segments === 0 ? 0 : Math.min(100, Math.round(usedInSegment / info.perSegment * 100));
	const filteredOutbox = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return outbox;
		return outbox.filter((item) => {
			const person = people.find((p) => p.phone === item.to)?.name ?? "";
			return item.text.toLowerCase().includes(q) || item.to.toLowerCase().includes(q) || person.toLowerCase().includes(q);
		});
	}, [
		outbox,
		people,
		query
	]);
	const today = (0, import_react.useMemo)(() => {
		const start = startOfDay(/* @__PURE__ */ new Date()).getTime();
		const rows = outbox.filter((item) => item.at >= start && item.status !== "failed");
		return {
			msgs: rows.length,
			segs: rows.reduce((sum, item) => sum + item.segments, 0)
		};
	}, [outbox]);
	const whoLabel = recipients.map((phone) => names[phone] ?? formatPretty(phone)).join(", ");
	const openChannel = channels.find((channel) => channel.id === channelId) ?? null;
	function flashShake() {
		setShake(true);
		window.setTimeout(() => setShake(false), 420);
	}
	function requestSend() {
		if (!canSend) {
			flashShake();
			if (!line.connected) toast.error(line.error || copy.offlineErr);
			else if (line.paused) toast.error(copy.pausedErr);
			else if (issue) toast.error(issue);
			else if (!text.trim()) toast.error(copy.writeFirst);
			else if (!nameTokensOk(text)) toast.error(copy.removeBraces);
			else if (!nameReady) toast.error(copy.needNameToken);
			return;
		}
		if (settings.confirm) setConfirmOpen(true);
		else confirmSend();
	}
	async function confirmSend() {
		if (recipients.length === 0) return;
		setSending(true);
		const body = composeBody(text, settings.signature);
		try {
			const result = await sendSms({ data: {
				to: recipients,
				text: body,
				names,
				channel: sendMode
			} });
			if (result.ok) {
				const status = result.paused ? "paused" : "queued";
				setOutbox((prev) => [{
					id: crypto.randomUUID(),
					to: recipients[0],
					recipients,
					text: body,
					status,
					messageId: result.messageId,
					at: Date.now(),
					segments: Math.max(1, info.segments),
					channel: sendMode
				}, ...prev].slice(0, 40));
				toast.success(status === "paused" ? copy.pausedErr : `${copy.queued} · ${whoLabel}`);
				setText("");
			} else {
				setOutbox((prev) => [{
					id: crypto.randomUUID(),
					to: recipients[0],
					recipients,
					text: body,
					status: "failed",
					error: result.error,
					at: Date.now(),
					segments: Math.max(1, info.segments),
					channel: sendMode
				}, ...prev].slice(0, 40));
				toast.error(result.error);
				flashShake();
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : copy.sendFail);
			flashShake();
		} finally {
			setSending(false);
			setConfirmOpen(false);
		}
	}
	function savePerson() {
		if (!primary || issue) {
			toast.error(copy.validNumber);
			return;
		}
		const name = personName.trim();
		if (!name) {
			toast.error(copy.giveName);
			return;
		}
		setPeople((prev) => {
			const rest = prev.filter((person) => person.phone !== primary);
			return [{
				id: crypto.randomUUID(),
				name,
				phone: primary
			}, ...rest].slice(0, 16);
		});
		setPersonName("");
		setPeopleOpen(false);
		toast.success(copy.savedPerson(name));
	}
	function saveTemplate() {
		const title = templateTitle.trim();
		const body = text.trim();
		if (!title || !body) {
			toast.error(copy.writeFirst);
			return;
		}
		setTemplates((prev) => [{
			id: crypto.randomUUID(),
			title,
			text: body
		}, ...prev].slice(0, 12));
		setTemplateTitle("");
		setTemplateOpen(false);
		toast.success(copy.savedTemplate);
	}
	async function connectWhatsApp() {
		setWaConnecting(true);
		try {
			const result = await saveWhatsApp({ data: {
				token: waToken,
				phoneNumberId: waPhoneId,
				template: waTemplate,
				language: "en_US"
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setWhatsappLine({
				connected: true,
				from: result.from,
				paused: false
			});
			setSendMode("whatsapp");
			setWaToken("");
			toast.success(result.verifiedName ? `${copy.waConnected} · ${result.verifiedName}` : copy.waConnected);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : copy.sendFail);
		} finally {
			setWaConnecting(false);
		}
	}
	async function refreshStatus(item) {
		if (!item.messageId) {
			toast.error(copy.noId);
			return;
		}
		setCheckingId(item.id);
		try {
			const result = await getSmsStatus({ data: {
				messageId: item.messageId,
				channel: item.channel === "imessage" ? "imessage" : "sms"
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setOutbox((prev) => prev.map((row) => row.id === item.id ? {
				...row,
				status: result.status,
				error: result.error ?? row.error,
				segments: "segmentCount" in result && result.segmentCount ? result.segmentCount : row.segments
			} : row));
			toast.success(copy.updated(statusLabel[result.status]));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : copy.refreshFail);
		} finally {
			setCheckingId(null);
		}
	}
	async function pullHistory() {
		setPulling(true);
		try {
			const result = await listSmsHistory();
			let added = 0;
			setOutbox((prev) => {
				const have = new Set(prev.map((item) => item.messageId).filter(Boolean));
				const extra = [];
				if (result.sms.ok) for (const remote of result.sms.messages) {
					if (have.has(remote.id)) continue;
					have.add(remote.id);
					added += 1;
					extra.push({
						id: remote.id,
						to: remote.to[0] ?? "",
						recipients: remote.to,
						text: remote.text,
						status: remote.paused ? "paused" : "queued",
						messageId: remote.id,
						at: Date.parse(remote.createdAt) || Date.now(),
						segments: 1,
						channel: "sms"
					});
				}
				if (result.imessage.ok) for (const remote of result.imessage.messages) {
					if (have.has(remote.id)) continue;
					have.add(remote.id);
					added += 1;
					extra.push({
						id: remote.id,
						to: remote.to,
						recipients: [remote.to],
						text: remote.text,
						status: remote.status.toUpperCase() === "DELIVERED" ? "sent" : remote.status.toUpperCase() === "ERROR" ? "failed" : "queued",
						messageId: remote.id,
						at: Date.parse(remote.createdAt) || Date.now(),
						segments: 1,
						channel: "imessage"
					});
				}
				extra.sort((a, b) => b.at - a.at);
				return [...extra, ...prev].slice(0, 40);
			});
			const err = !result.sms.ok ? result.sms.error : !result.imessage.ok ? result.imessage.error : null;
			if (err && added === 0) toast.error(err);
			else toast.success(copy.historyOk(added));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : copy.historyFail);
		} finally {
			setPulling(false);
		}
	}
	async function copyText(value, label) {
		try {
			await navigator.clipboard.writeText(value);
			toast.success(copy.copied(label));
		} catch {
			toast.error(copy.copyFail);
		}
	}
	function displayTo(item) {
		const nums = item.recipients?.length ? item.recipients : [item.to];
		if (nums.length > 1) {
			if (nums.length <= 4) return `${nums.length} příjemci`;
			return `${nums.length} příjemců`;
		}
		return people.find((person) => person.phone === item.to)?.name ?? formatPretty(item.to);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "page-safe mx-auto flex min-h-dvh max-w-5xl flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { className: "bg-surface text-foreground shadow-border font-sans text-sm" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "stagger-in flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted-foreground",
					children: copy.studio
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl italic leading-tight tracking-tight text-foreground sm:text-5xl",
					children: "Wire"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": copy.settings,
						onClick: () => setSettingsOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineBadge, {
						line,
						from,
						mode: sendMode
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stagger-in mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground",
				children: copy.tagline(formatPretty(from), sendMode)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "stagger-in mt-6",
				"aria-labelledby": "channels-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "channels-heading",
						className: "text-xs font-medium tracking-widest text-muted-foreground",
						children: copy.channels
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden text-xs text-subtle sm:block",
						children: copy.channelsHint
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
					children: channels.map((channel) => {
						const status = channel.id === "whatsapp" && whatsappLine.connected ? "live" : channel.status;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setChannelId(channel.id),
							className: "flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 py-2 text-left shadow-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground",
								children: channel.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelStatusMark, { status })]
						}, channel.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid flex-1 gap-5 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: cn("stagger-in rounded-2xl bg-card p-5 shadow-border lg:col-span-3", shake && "animate-shake"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl italic tracking-tight",
								children: copy.write
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pb-1 font-mono text-xs text-subtle",
								children: info.segments === 0 ? copy.max : copy.smsCount(info.segments, info.encoding)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSendMode("imessage"),
									className: cn("h-11 flex-1 rounded-full px-4 text-sm shadow-border", sendMode === "imessage" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"),
									children: copy.viaIMessage
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSendMode("sms"),
									className: cn("h-11 flex-1 rounded-full px-4 text-sm shadow-border", sendMode === "sms" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"),
									children: copy.viaSms
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										if (!whatsappLine.connected) {
											setSettingsOpen(true);
											return;
										}
										setSendMode("whatsapp");
									},
									className: cn("h-11 flex-1 rounded-full px-4 text-sm shadow-border", sendMode === "whatsapp" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"),
									children: copy.viaWhatsapp
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "to",
											children: copy.to
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "to",
											name: "to",
											type: "tel",
											inputMode: "tel",
											autoComplete: "tel",
											placeholder: sendMode === "sms" ? copy.toPlaceholderSms : copy.toPlaceholder,
											value: to,
											onChange: (e) => setTo(e.target.value),
											"aria-invalid": Boolean(to) && Boolean(issue)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-subtle",
												children: issue ? issue : recipients.length > 1 ? whoLabel : primary ? `${known ? `${known.name} · ` : ""}${formatPretty(primary)}${lookup ? ` · ${lookup}` : ""}` : sendMode === "sms" ? copy.toHintSms : sendMode === "whatsapp" ? copy.toHintWhatsapp : copy.toHint
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
												onClick: () => setTo(from),
												children: copy.textThisLine
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "-mx-1 flex gap-2 overflow-x-auto px-1 pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													variant: "outline",
													size: "sm",
													className: "h-11 shrink-0 rounded-full",
													onClick: () => {
														setPersonName(known?.name ?? "");
														setPeopleOpen(true);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {}), copy.people]
												}),
												people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setTo(person.phone),
													className: cn("h-11 shrink-0 rounded-full px-4 text-sm shadow-border", primary === person.phone ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"),
													children: person.name
												}, person.id)),
												recents.map((phone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setTo(phone),
													className: cn("h-11 shrink-0 rounded-full px-4 font-mono text-xs shadow-border", primary === phone ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"),
													children: formatPretty(phone)
												}, phone))
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "body",
											children: copy.message
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "body",
											name: "body",
											placeholder: copy.messagePlaceholder,
											value: text,
											onChange: (e) => setText(e.target.value),
											maxLength: SMS_MAX_CHARS,
											onKeyDown: (e) => {
												if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
													e.preventDefault();
													requestSend();
												}
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1 overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("h-full rounded-full transition-[width] duration-150 ease-out", info.overLimit || !nameTokensOk(text) ? "bg-bad" : "bg-primary"),
												style: { width: `${meterPct}%` }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: cn("font-mono text-xs tabular-nums", info.overLimit || !nameTokensOk(text) ? "text-bad" : "text-subtle"),
												children: !nameTokensOk(text) ? copy.removeBraces : info.segments === 0 ? `${text.length} / ${SMS_MAX_CHARS}` : copy.leftInSms(info.remaining, info.segments)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs tabular-nums text-subtle",
												children: copy.chars(text.length)
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setText(copy.helloBody),
											children: copy.hello
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setText(copy.codeBody(sixDigitCode())),
											children: copy.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setText(copy.reminderBody),
											children: copy.reminder
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setText((prev) => prev.includes("{{name}}") ? prev : `${prev}{{name}}`.trim()),
											children: copy.insertName
										}),
										templates.map((tpl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "secondary",
											size: "sm",
											onClick: () => setText(tpl.text),
											onContextMenu: (e) => {
												e.preventDefault();
												setTemplates((prev) => prev.filter((item) => item.id !== tpl.id));
											},
											children: tpl.title
										}, tpl.id)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											onClick: () => setTemplateOpen(true),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, {}), copy.saveTemplate]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "lg",
									className: "w-full",
									disabled: sending,
									onClick: requestSend,
									children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), copy.sending] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [info.segments > 1 ? copy.sendN(info.segments) : sendMode === "imessage" ? copy.sendIMessage : sendMode === "whatsapp" ? copy.sendWhatsapp : copy.send, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-xs text-subtle",
									children: copy.confirmHint
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "stagger-in flex flex-col rounded-2xl bg-card p-5 shadow-border lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl italic tracking-tight",
								children: copy.outbox
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-xs text-subtle",
								children: copy.today(today.msgs, today.segs)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									disabled: pulling,
									onClick: () => void pullHistory(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: cn(pulling && "animate-spin") }), copy.pullHistory]
								}), outbox.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => setOutbox([]),
									"aria-label": copy.clearOutbox,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), copy.clear]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mt-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "search",
								name: "search",
								type: "search",
								placeholder: copy.search,
								value: query,
								onChange: (e) => setQuery(e.target.value),
								className: "font-sans tracking-normal"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex-1",
							children: !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-subtle",
								children: copy.loading
							}) : filteredOutbox.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: copy.emptyOutbox
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: filteredOutbox.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md bg-surface-2 px-3 py-3 shadow-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs text-foreground",
												children: displayTo(item)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "queued",
													children: item.channel === "imessage" ? copy.viaIMessage : item.channel === "whatsapp" ? copy.viaWhatsapp : copy.viaSms
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: item.status })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground",
											children: item.text
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-subtle",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDistanceToNow(item.at, {
													addSuffix: true,
													locale: cs
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": "true",
													children: "·"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular-nums",
													children: [item.segments, " SMS"]
												})
											]
										}),
										item.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-bad",
											children: item.error
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex flex-wrap gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: () => {
														const nums = item.recipients?.length ? item.recipients : [item.to];
														setTo(nums.join(", "));
														setText(item.text);
														toast.success(copy.loadedResend);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), copy.resend]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													disabled: !item.messageId || checkingId === item.id,
													onClick: () => void refreshStatus(item),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn(checkingId === item.id && "animate-spin") }), copy.status]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: () => void copyText(item.text, copy.messageLabel),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copy.copy]
												})
											]
										})
									]
								}, item.id))
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmOpen,
				onOpenChange: setConfirmOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: copy.confirmTitle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: recipients.length ? copy.confirmBody(whoLabel, Math.max(1, info.segments), formatPretty(from), sendMode) : copy.validNumber })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 line-clamp-4 rounded-md bg-surface-2 px-3 py-3 text-sm leading-relaxed text-foreground shadow-border",
						children: composeBody(text, settings.signature) || copy.emptyMessage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						disabled: sending,
						children: copy.cancel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						disabled: sending || !canSend,
						onClick: (e) => {
							e.preventDefault();
							confirmSend();
						},
						children: sending ? copy.sending : copy.sendNow
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: peopleOpen,
				onOpenChange: setPeopleOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: copy.peopleTitle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: copy.peopleDesc })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "person-name",
									children: copy.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "person-name",
									name: "person-name",
									placeholder: copy.namePlaceholder,
									value: personName,
									onChange: (e) => setPersonName(e.target.value),
									className: "font-sans tracking-normal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: primary && !issue ? formatPretty(primary) : copy.validNumber
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							className: "w-full",
							onClick: savePerson,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), copy.savePerson]
						}),
						people.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 rounded-md bg-surface-2 px-3 py-2 shadow-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "min-w-0 flex-1 text-left",
									onClick: () => {
										setTo(person.phone);
										setPeopleOpen(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-foreground",
										children: person.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-mono text-xs text-subtle",
										children: formatPretty(person.phone)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-11 shrink-0",
									"aria-label": copy.removePerson(person.name),
									onClick: () => setPeople((prev) => prev.filter((row) => row.id !== person.id)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							}, person.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: copy.noPeople
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: copy.settings }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: copy.settingsDesc })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "signature",
								children: copy.signature
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "signature",
								name: "signature",
								placeholder: copy.signaturePlaceholder,
								value: settings.signature,
								onChange: (e) => setSettings((prev) => ({
									...prev,
									signature: e.target.value
								})),
								className: "min-h-24"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground",
								children: copy.confirmToggle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: settings.confirm,
								onCheckedChange: (confirm) => setSettings((prev) => ({
									...prev,
									confirm
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium text-foreground",
									children: copy.waSetup
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: copy.waSetupDesc
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "wa-phone-id",
										children: copy.waPhoneId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "wa-phone-id",
										name: "wa-phone-id",
										placeholder: "106540352242922",
										value: waPhoneId,
										onChange: (e) => setWaPhoneId(e.target.value),
										className: "font-mono tracking-normal"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "wa-token",
										children: copy.waToken
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "wa-token",
										name: "wa-token",
										type: "password",
										autoComplete: "off",
										placeholder: "EAA…",
										value: waToken,
										onChange: (e) => setWaToken(e.target.value),
										className: "font-sans tracking-normal"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "wa-template",
										children: copy.waTemplate
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "wa-template",
										name: "wa-template",
										placeholder: "hello_world",
										value: waTemplate,
										onChange: (e) => setWaTemplate(e.target.value),
										className: "font-mono tracking-normal"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									className: "w-full",
									disabled: waConnecting,
									onClick: () => void connectWhatsApp(),
									children: waConnecting ? copy.waConnecting : copy.waConnect
								}),
								whatsappLine.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [copy.waConnected, whatsappLine.from ? ` · ${formatPretty(whatsappLine.from)}` : ""]
								}) : whatsappLine.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-bad",
									children: whatsappLine.error
								}) : null
							]
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: templateOpen,
				onOpenChange: setTemplateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: copy.saveTemplate }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: copy.templateTitle })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "template-title",
						name: "template-title",
						placeholder: copy.templatePlaceholder,
						value: templateTitle,
						onChange: (e) => setTemplateTitle(e.target.value),
						className: "font-sans tracking-normal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "w-full",
						onClick: saveTemplate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, {}), copy.save]
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(openChannel),
				onOpenChange: (open) => {
					if (!open) setChannelId(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: openChannel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: openChannel.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: openChannel.summary })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelStatusMark, { status: openChannel.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-foreground",
							children: openChannel.detail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-surface-2 px-3 py-3 shadow-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-muted-foreground",
								children: copy.channelNeeds
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-foreground",
								children: openChannel.needs
							})]
						}),
						openChannel.id === "whatsapp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							className: "w-full",
							onClick: () => {
								setChannelId(null);
								setSettingsOpen(true);
							},
							children: copy.waSetup
						}) : null
					]
				})] }) : null })
			})
		]
	});
}
function LineBadge({ line, from, mode }) {
	if (line.paused) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "warn",
		className: "whitespace-nowrap",
		children: copy.paused
	});
	if (line.connected) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "live",
		className: "whitespace-nowrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pulse-dot",
				"aria-hidden": "true"
			}),
			mode === "imessage" ? copy.viaIMessage : mode === "whatsapp" ? copy.viaWhatsapp : copy.live,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden sm:inline",
				children: ["· ", formatPretty(from)]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "warn",
		className: "whitespace-nowrap",
		children: line.error ? copy.offline : copy.connecting
	});
}
function ChannelStatusMark({ status }) {
	const label = status === "live" ? copy.channelLive : status === "provision" ? copy.channelProvision : status === "closed" ? copy.channelClosed : copy.channelPartner;
	if (status === "live") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "live",
		className: "whitespace-nowrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pulse-dot",
			"aria-hidden": "true"
		}), label]
	});
	if (status === "provision") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "queued",
		children: label
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "warn",
		children: label
	});
}
function StatusPill({ status }) {
	if (status === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "warn",
		children: copy.failed
	});
	if (status === "paused") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "warn",
		children: copy.paused
	});
	if (status === "sent") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "live",
		children: copy.sent
	});
	if (status === "processed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "queued",
		children: copy.processed
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "queued",
		children: copy.queued
	});
}
function Home() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmsStudio, { initial: data ?? FALLBACK });
}
//#endregion
export { Home as component };
