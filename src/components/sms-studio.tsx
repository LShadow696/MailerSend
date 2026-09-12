import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow, startOfDay } from "date-fns";
import { cs } from "date-fns/locale";
import {
  ArrowUpRight,
  BookmarkPlus,
  Copy,
  History,
  LoaderCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  getChannelStatus,
  getSmsStatus,
  listSmsHistory,
  lookupService,
  saveWhatsApp,
  sendSms,
} from "@/lib/sms/api";
import {
  DRAFT_KEY,
  FROM_NUMBER,
  IMESSAGE_FROM,
  OUTBOX_KEY,
  OUTBOX_LIMIT,
  PEOPLE_KEY,
  PEOPLE_LIMIT,
  SETTINGS_KEY,
  SMS_MAX_CHARS,
  TEMPLATES_KEY,
  TEMPLATES_LIMIT,
} from "@/lib/sms/constants";
import { copy, statusLabel } from "@/lib/sms/copy";
import { channels, type Channel, type ChannelStatus } from "@/lib/sms/channels";
import {
  formatPretty,
  nameTokensOk,
  parseRecipients,
  recipientsIssue,
  type SendMode,
} from "@/lib/sms/phone";
import { analyzeMessage } from "@/lib/sms/segments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type LineStatus = {
  connected: boolean;
  from: string;
  paused: boolean;
  error?: string;
};

type OutboxStatus = "queued" | "processed" | "sent" | "failed" | "paused";

type OutboxItem = {
  id: string;
  to: string;
  recipients?: string[];
  text: string;
  status: OutboxStatus;
  messageId?: string;
  error?: string;
  at: number;
  segments: number;
  channel?: SendMode;
};

type Person = { id: string; name: string; phone: string };
type Template = { id: string; title: string; text: string };
type SettingsState = { signature: string; confirm: boolean };

type LinesPayload = {
  sms: LineStatus;
  imessage: LineStatus;
  whatsapp: LineStatus;
  contacts: Array<{ name: string; phone: string }>;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function sixDigitCode() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return n.toString().padStart(6, "0");
}

function composeBody(text: string, signature: string) {
  const body = text.trim();
  const sig = signature.trim();
  if (!sig || body.endsWith(sig)) return body;
  return `${body}\n${sig}`;
}

const FALLBACK_LINES: LinesPayload = {
  sms: { connected: false, from: FROM_NUMBER, paused: false },
  imessage: { connected: false, from: IMESSAGE_FROM, paused: false },
  whatsapp: { connected: false, from: "", paused: false },
  contacts: [],
};

const DEFAULT_SETTINGS: SettingsState = { signature: "", confirm: true };

export function SmsStudio({ initial }: { initial?: LinesPayload }) {
  const seed = initial ?? FALLBACK_LINES;
  const [smsLine, setSmsLine] = useState<LineStatus>(seed.sms);
  const [imessageLine, setImessageLine] = useState<LineStatus>(seed.imessage);
  const [whatsappLine, setWhatsappLine] = useState<LineStatus>(seed.whatsapp);
  const [sendMode, setSendMode] = useState<SendMode>("imessage");
  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [shake, setShake] = useState(false);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [people, setPeople] = useState<Person[]>(() =>
    (seed.contacts ?? []).map((row) => ({
      id: row.phone,
      name: row.name,
      phone: row.phone,
    })),
  );
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [personName, setPersonName] = useState("");
  const [templateTitle, setTemplateTitle] = useState("");
  const [query, setQuery] = useState("");
  const [channelId, setChannelId] = useState<Channel["id"] | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);
  const [lookup, setLookup] = useState<string | null>(null);
  const [waPhoneId, setWaPhoneId] = useState("");
  const [waToken, setWaToken] = useState("");
  const [waTemplate, setWaTemplate] = useState("hello_world");
  const [waConnecting, setWaConnecting] = useState(false);

  useEffect(() => {
    const draft = readJson<{ to?: string; text?: string; channel?: SendMode }>(
      DRAFT_KEY,
      {},
    );
    setTo(typeof draft.to === "string" ? draft.to : "");
    setText(typeof draft.text === "string" ? draft.text : "");
    if (
      draft.channel === "sms" ||
      draft.channel === "imessage" ||
      draft.channel === "whatsapp"
    ) {
      setSendMode(draft.channel);
    }
    const storedOutbox = readJson<OutboxItem[]>(OUTBOX_KEY, []);
    setOutbox(Array.isArray(storedOutbox) ? storedOutbox : []);
    const storedPeople = readJson<Person[]>(PEOPLE_KEY, []);
    if (Array.isArray(storedPeople) && storedPeople.length) {
      setPeople((prev) => {
        const have = new Set(storedPeople.map((person) => person.phone));
        const extra = prev.filter((person) => !have.has(person.phone));
        return [...storedPeople, ...extra].slice(0, PEOPLE_LIMIT);
      });
    }
    const storedTemplates = readJson<Template[]>(TEMPLATES_KEY, []);
    setTemplates(Array.isArray(storedTemplates) ? storedTemplates : []);
    const storedSettings = readJson<SettingsState>(
      SETTINGS_KEY,
      DEFAULT_SETTINGS,
    );
    setSettings({
      signature:
        typeof storedSettings.signature === "string"
          ? storedSettings.signature
          : "",
      confirm: storedSettings.confirm !== false,
    });
    setHydrated(true);
    let cancelled = false;
    getChannelStatus()
      .then((status) => {
        if (cancelled) return;
        setSmsLine(status.sms);
        setImessageLine(status.imessage);
        setWhatsappLine(status.whatsapp);
        if (status.contacts.length) {
          setPeople((prev) => {
            const have = new Set(prev.map((person) => person.phone));
            const extra = status.contacts
              .filter((row) => row.phone && !have.has(row.phone))
              .map((row) => ({
                id: crypto.randomUUID(),
                name: row.name,
                phone: row.phone,
              }));
            return [...prev, ...extra].slice(0, PEOPLE_LIMIT);
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSmsLine((prev) =>
            prev.connected
              ? prev
              : { ...prev, error: copy.offlineErr },
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      OUTBOX_KEY,
      JSON.stringify(outbox.slice(0, OUTBOX_LIMIT)),
    );
  }, [hydrated, outbox]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      PEOPLE_KEY,
      JSON.stringify(people.slice(0, PEOPLE_LIMIT)),
    );
  }, [hydrated, people]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      TEMPLATES_KEY,
      JSON.stringify(templates.slice(0, TEMPLATES_LIMIT)),
    );
  }, [hydrated, templates]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [hydrated, settings]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ to, text, channel: sendMode }));
  }, [hydrated, to, text, sendMode]);

  const line =
    sendMode === "imessage"
      ? imessageLine
      : sendMode === "whatsapp"
        ? whatsappLine
        : smsLine;
  const from =
    line.from ||
    (sendMode === "imessage"
      ? IMESSAGE_FROM
      : sendMode === "whatsapp"
        ? ""
        : FROM_NUMBER);
  const issue = recipientsIssue(to, sendMode);
  const recipients = parseRecipients(to);
  const primary = recipients[0] ?? null;
  const info = useMemo(
    () => analyzeMessage(composeBody(text, settings.signature)),
    [text, settings.signature],
  );
  const known = people.find((person) => person.phone === primary);
  const names = useMemo(() => {
    const map: Record<string, string> = {};
    for (const person of people) map[person.phone] = person.name;
    return map;
  }, [people]);
  const recents = useMemo(() => {
    const seen = new Set(people.map((person) => person.phone));
    const list: string[] = [];
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
  const nameReady =
    !text.includes("{{name}}") ||
    recipients.every((phone) => Boolean(names[phone]));
  const canSend =
    recipients.length > 0 &&
    !issue &&
    text.trim().length > 0 &&
    !info.overLimit &&
    nameTokensOk(text) &&
    nameReady &&
    !sending &&
    line.connected &&
    !line.paused;

  useEffect(() => {
    if (!primary || issue) {
      setLookup(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      lookupService({ data: { number: primary } })
        .then((result) => {
          if (!cancelled && result.ok) setLookup(result.service);
        })
        .catch(() => {
          if (!cancelled) setLookup(null);
        });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [primary, issue]);

  const usedInSegment =
    info.segments === 0 ? 0 : info.perSegment - info.remaining;
  const meterPct =
    info.segments === 0
      ? 0
      : Math.min(100, Math.round((usedInSegment / info.perSegment) * 100));
  const filteredOutbox = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return outbox;
    return outbox.filter((item) => {
      const person = people.find((p) => p.phone === item.to)?.name ?? "";
      return (
        item.text.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q) ||
        person.toLowerCase().includes(q)
      );
    });
  }, [outbox, people, query]);
  const today = useMemo(() => {
    const start = startOfDay(new Date()).getTime();
    const rows = outbox.filter(
      (item) => item.at >= start && item.status !== "failed",
    );
    return {
      msgs: rows.length,
      segs: rows.reduce((sum, item) => sum + item.segments, 0),
    };
  }, [outbox]);
  const whoLabel = recipients
    .map((phone) => names[phone] ?? formatPretty(phone))
    .join(", ");
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
    else void confirmSend();
  }

  async function confirmSend() {
    if (recipients.length === 0) return;
    setSending(true);
    const body = composeBody(text, settings.signature);
    try {
      const result = await sendSms({
        data: { to: recipients, text: body, names, channel: sendMode },
      });
      if (result.ok) {
        const status: OutboxStatus = result.paused ? "paused" : "queued";
        setOutbox((prev) =>
          [
            {
              id: crypto.randomUUID(),
              to: recipients[0],
              recipients,
              text: body,
              status,
              messageId: result.messageId,
              at: Date.now(),
              segments: Math.max(1, info.segments),
              channel: sendMode,
            },
            ...prev,
          ].slice(0, OUTBOX_LIMIT),
        );
        toast.success(
          status === "paused"
            ? copy.pausedErr
            : `${copy.queued} · ${whoLabel}`,
        );
        setText("");
      } else {
        setOutbox((prev) =>
          [
            {
              id: crypto.randomUUID(),
              to: recipients[0],
              recipients,
              text: body,
              status: "failed" as const,
              error: result.error,
              at: Date.now(),
              segments: Math.max(1, info.segments),
              channel: sendMode,
            },
            ...prev,
          ].slice(0, OUTBOX_LIMIT),
        );
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
      return [{ id: crypto.randomUUID(), name, phone: primary }, ...rest].slice(
        0,
        PEOPLE_LIMIT,
      );
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
    setTemplates((prev) =>
      [{ id: crypto.randomUUID(), title, text: body }, ...prev].slice(
        0,
        TEMPLATES_LIMIT,
      ),
    );
    setTemplateTitle("");
    setTemplateOpen(false);
    toast.success(copy.savedTemplate);
  }

  async function connectWhatsApp() {
    setWaConnecting(true);
    try {
      const result = await saveWhatsApp({
        data: {
          token: waToken,
          phoneNumberId: waPhoneId,
          template: waTemplate,
          language: "en_US",
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setWhatsappLine({
        connected: true,
        from: result.from,
        paused: false,
      });
      setSendMode("whatsapp");
      setWaToken("");
      toast.success(
        result.verifiedName
          ? `${copy.waConnected} · ${result.verifiedName}`
          : copy.waConnected,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : copy.sendFail);
    } finally {
      setWaConnecting(false);
    }
  }

  async function refreshStatus(item: OutboxItem) {
    if (!item.messageId) {
      toast.error(copy.noId);
      return;
    }
    setCheckingId(item.id);
    try {
      const result = await getSmsStatus({
        data: {
          messageId: item.messageId,
          channel: item.channel === "imessage" ? "imessage" : "sms",
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setOutbox((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? {
                ...row,
                status: result.status,
                error: result.error ?? row.error,
                segments:
                  "segmentCount" in result && result.segmentCount
                    ? result.segmentCount
                    : row.segments,
              }
            : row,
        ),
      );
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
        const have = new Set(
          prev.map((item) => item.messageId).filter(Boolean),
        );
        const extra: OutboxItem[] = [];
        if (result.sms.ok) {
          for (const remote of result.sms.messages) {
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
              channel: "sms",
            });
          }
        }
        if (result.imessage.ok) {
          for (const remote of result.imessage.messages) {
            if (have.has(remote.id)) continue;
            have.add(remote.id);
            added += 1;
            extra.push({
              id: remote.id,
              to: remote.to,
              recipients: [remote.to],
              text: remote.text,
              status:
                remote.status.toUpperCase() === "DELIVERED"
                  ? "sent"
                  : remote.status.toUpperCase() === "ERROR"
                    ? "failed"
                    : "queued",
              messageId: remote.id,
              at: Date.parse(remote.createdAt) || Date.now(),
              segments: 1,
              channel: "imessage",
            });
          }
        }
        extra.sort((a, b) => b.at - a.at);
        return [...extra, ...prev].slice(0, OUTBOX_LIMIT);
      });
      const err = !result.sms.ok
        ? result.sms.error
        : !result.imessage.ok
          ? result.imessage.error
          : null;
      if (err && added === 0) toast.error(err);
      else toast.success(copy.historyOk(added));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : copy.historyFail);
    } finally {
      setPulling(false);
    }
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(copy.copied(label));
    } catch {
      toast.error(copy.copyFail);
    }
  }

  function displayTo(item: OutboxItem) {
    const nums = item.recipients?.length ? item.recipients : [item.to];
    if (nums.length > 1) {
      if (nums.length <= 4) return `${nums.length} příjemci`;
      return `${nums.length} příjemců`;
    }
    return people.find((person) => person.phone === item.to)?.name ?? formatPretty(item.to);
  }

  return (
    <div className="page-safe mx-auto flex min-h-dvh max-w-5xl flex-col">
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          className:
            "bg-surface text-foreground shadow-border font-sans text-sm",
        }}
      />

      <header className="stagger-in flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground">
            {copy.studio}
          </p>
          <h1 className="mt-1 font-display text-4xl italic leading-tight tracking-tight text-foreground sm:text-5xl">
            Wire
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={copy.settings}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings />
          </Button>
          <LineBadge line={line} from={from} mode={sendMode} />
        </div>
      </header>

      <p className="stagger-in mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
        {copy.tagline(formatPretty(from), sendMode)}
      </p>

      <section className="stagger-in mt-6" aria-labelledby="channels-heading">
        <div className="flex items-end justify-between gap-3">
          <h2 id="channels-heading" className="text-xs font-medium tracking-widest text-muted-foreground">
            {copy.channels}
          </h2>
          <p className="hidden text-xs text-subtle sm:block">{copy.channelsHint}</p>
        </div>
        <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {channels.map((channel) => {
            const status =
              channel.id === "whatsapp" && whatsappLine.connected
                ? "live"
                : channel.status;
            return (
            <button
              key={channel.id}
              type="button"
              onClick={() => setChannelId(channel.id)}
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 py-2 text-left shadow-border"
            >
              <span className="text-sm text-foreground">{channel.name}</span>
              <ChannelStatusMark status={status} />
            </button>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid flex-1 gap-5 lg:grid-cols-5">
        <section
          className={cn(
            "stagger-in rounded-2xl bg-card p-5 shadow-border lg:col-span-3",
            shake && "animate-shake",
          )}
        >
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl italic tracking-tight">
              {copy.write}
            </h2>
            <span className="pb-1 font-mono text-xs text-subtle">
              {info.segments === 0
                ? copy.max
                : copy.smsCount(info.segments, info.encoding)}
            </span>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setSendMode("imessage")}
              className={cn(
                "h-11 flex-1 rounded-full px-4 text-sm shadow-border",
                sendMode === "imessage"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-foreground",
              )}
            >
              {copy.viaIMessage}
            </button>
            <button
              type="button"
              onClick={() => setSendMode("sms")}
              className={cn(
                "h-11 flex-1 rounded-full px-4 text-sm shadow-border",
                sendMode === "sms"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-foreground",
              )}
            >
              {copy.viaSms}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!whatsappLine.connected) {
                  setSettingsOpen(true);
                  return;
                }
                setSendMode("whatsapp");
              }}
              className={cn(
                "h-11 flex-1 rounded-full px-4 text-sm shadow-border",
                sendMode === "whatsapp"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-foreground",
              )}
            >
              {copy.viaWhatsapp}
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="to">{copy.to}</Label>
              <Input
                id="to"
                name="to"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={
                  sendMode === "sms"
                    ? copy.toPlaceholderSms
                    : copy.toPlaceholder
                }
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-invalid={Boolean(to) && Boolean(issue)}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-subtle">
                  {issue
                    ? issue
                    : recipients.length > 1
                      ? whoLabel
                      : primary
                        ? `${known ? `${known.name} · ` : ""}${formatPretty(primary)}${lookup ? ` · ${lookup}` : ""}`
                        : sendMode === "sms"
                          ? copy.toHintSms
                          : sendMode === "whatsapp"
                            ? copy.toHintWhatsapp
                            : copy.toHint}
                </p>
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  onClick={() => setTo(from)}
                >
                  {copy.textThisLine}
                </button>
              </div>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-11 shrink-0 rounded-full"
                  onClick={() => {
                    setPersonName(known?.name ?? "");
                    setPeopleOpen(true);
                  }}
                >
                  <UserPlus />
                  {copy.people}
                </Button>
                {people.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => setTo(person.phone)}
                    className={cn(
                      "h-11 shrink-0 rounded-full px-4 text-sm shadow-border",
                      primary === person.phone
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-2 text-foreground",
                    )}
                  >
                    {person.name}
                  </button>
                ))}
                {recents.map((phone) => (
                  <button
                    key={phone}
                    type="button"
                    onClick={() => setTo(phone)}
                    className={cn(
                      "h-11 shrink-0 rounded-full px-4 font-mono text-xs shadow-border",
                      primary === phone
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-2 text-muted-foreground",
                    )}
                  >
                    {formatPretty(phone)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">{copy.message}</Label>
              <Textarea
                id="body"
                name="body"
                placeholder={copy.messagePlaceholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={SMS_MAX_CHARS}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    requestSend();
                  }
                }}
              />
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-150 ease-out",
                    info.overLimit || !nameTokensOk(text)
                      ? "bg-bad"
                      : "bg-primary",
                  )}
                  style={{ width: `${meterPct}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    info.overLimit || !nameTokensOk(text)
                      ? "text-bad"
                      : "text-subtle",
                  )}
                >
                  {!nameTokensOk(text)
                    ? copy.removeBraces
                    : info.segments === 0
                      ? `${text.length} / ${SMS_MAX_CHARS}`
                      : copy.leftInSms(info.remaining, info.segments)}
                </p>
                <p className="font-mono text-xs tabular-nums text-subtle">
                  {copy.chars(text.length)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setText(copy.helloBody)}
              >
                {copy.hello}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setText(copy.codeBody(sixDigitCode()))}
              >
                {copy.code}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setText(copy.reminderBody)}
              >
                {copy.reminder}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setText((prev) =>
                    prev.includes("{{name}}") ? prev : `${prev}{{name}}`.trim(),
                  )
                }
              >
                {copy.insertName}
              </Button>
              {templates.map((tpl) => (
                <Button
                  key={tpl.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setText(tpl.text)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setTemplates((prev) =>
                      prev.filter((item) => item.id !== tpl.id),
                    );
                  }}
                >
                  {tpl.title}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTemplateOpen(true)}
              >
                <BookmarkPlus />
                {copy.saveTemplate}
              </Button>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={sending}
              onClick={requestSend}
            >
              {sending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {copy.sending}
                </>
              ) : (
                <>
                  {info.segments > 1
                    ? copy.sendN(info.segments)
                    : sendMode === "imessage"
                      ? copy.sendIMessage
                      : sendMode === "whatsapp"
                        ? copy.sendWhatsapp
                        : copy.send}
                  <ArrowUpRight />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-subtle">{copy.confirmHint}</p>
          </div>
        </section>

        <aside className="stagger-in flex flex-col rounded-2xl bg-card p-5 shadow-border lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl italic tracking-tight">
                {copy.outbox}
              </h2>
              <p className="mt-1 font-mono text-xs text-subtle">
                {copy.today(today.msgs, today.segs)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pulling}
                onClick={() => void pullHistory()}
              >
                <History className={cn(pulling && "animate-spin")} />
                {copy.pullHistory}
              </Button>
              {outbox.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOutbox([])}
                  aria-label={copy.clearOutbox}
                >
                  <Trash2 />
                  {copy.clear}
                </Button>
              )}
            </div>
          </div>
          <Separator className="mt-4" />
          <div className="mt-4">
            <Input
              id="search"
              name="search"
              type="search"
              placeholder={copy.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="font-sans tracking-normal"
            />
          </div>
          <div className="mt-4 flex-1">
            {!hydrated ? (
              <p className="text-sm text-subtle">{copy.loading}</p>
            ) : filteredOutbox.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.emptyOutbox}
              </p>
            ) : (
              <ul className="space-y-3">
                {filteredOutbox.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md bg-surface-2 px-3 py-3 shadow-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-xs text-foreground">
                        {displayTo(item)}
                      </p>
                      <div className="flex items-center gap-1">
                        <Badge variant="queued">
                          {item.channel === "imessage"
                            ? copy.viaIMessage
                            : item.channel === "whatsapp"
                              ? copy.viaWhatsapp
                              : copy.viaSms}
                        </Badge>
                        <StatusPill status={item.status} />
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-subtle">
                      <span>
                        {formatDistanceToNow(item.at, {
                          addSuffix: true,
                          locale: cs,
                        })}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.segments} SMS</span>
                    </div>
                    {item.error ? (
                      <p className="mt-2 text-xs text-bad">{item.error}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const nums = item.recipients?.length
                            ? item.recipients
                            : [item.to];
                          setTo(nums.join(", "));
                          setText(item.text);
                          toast.success(copy.loadedResend);
                        }}
                      >
                        <RotateCcw />
                        {copy.resend}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!item.messageId || checkingId === item.id}
                        onClick={() => void refreshStatus(item)}
                      >
                        <RefreshCw
                          className={cn(
                            checkingId === item.id && "animate-spin",
                          )}
                        />
                        {copy.status}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          void copyText(item.text, copy.messageLabel)
                        }
                      >
                        <Copy />
                        {copy.copy}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {recipients.length
                ? copy.confirmBody(
                    whoLabel,
                    Math.max(1, info.segments),
                    formatPretty(from),
                    sendMode,
                  )
                : copy.validNumber}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="mt-3 line-clamp-4 rounded-md bg-surface-2 px-3 py-3 text-sm leading-relaxed text-foreground shadow-border">
            {composeBody(text, settings.signature) || copy.emptyMessage}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>{copy.cancel}</AlertDialogCancel>
            <AlertDialogAction
              disabled={sending || !canSend}
              onClick={(e) => {
                e.preventDefault();
                void confirmSend();
              }}
            >
              {sending ? copy.sending : copy.sendNow}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={peopleOpen} onOpenChange={setPeopleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.peopleTitle}</DialogTitle>
            <DialogDescription>{copy.peopleDesc}</DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="person-name">{copy.name}</Label>
              <Input
                id="person-name"
                name="person-name"
                placeholder={copy.namePlaceholder}
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="font-sans tracking-normal"
              />
              <p className="text-xs text-subtle">
                {primary && !issue ? formatPretty(primary) : copy.validNumber}
              </p>
            </div>
            <Button type="button" className="w-full" onClick={savePerson}>
              <Plus />
              {copy.savePerson}
            </Button>
            {people.length > 0 ? (
              <ul className="space-y-2">
                {people.map((person) => (
                  <li
                    key={person.id}
                    className="flex items-center justify-between gap-3 rounded-md bg-surface-2 px-3 py-2 shadow-border"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        setTo(person.phone);
                        setPeopleOpen(false);
                      }}
                    >
                      <p className="truncate text-sm text-foreground">
                        {person.name}
                      </p>
                      <p className="truncate font-mono text-xs text-subtle">
                        {formatPretty(person.phone)}
                      </p>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-11 shrink-0"
                      aria-label={copy.removePerson(person.name)}
                      onClick={() =>
                        setPeople((prev) =>
                          prev.filter((row) => row.id !== person.id),
                        )
                      }
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{copy.noPeople}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.settings}</DialogTitle>
            <DialogDescription>{copy.settingsDesc}</DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="signature">{copy.signature}</Label>
              <Textarea
                id="signature"
                name="signature"
                placeholder={copy.signaturePlaceholder}
                value={settings.signature}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    signature: e.target.value,
                  }))
                }
                className="min-h-24"
              />
            </div>
            <label className="flex min-h-11 items-center justify-between gap-3">
              <span className="text-sm text-foreground">{copy.confirmToggle}</span>
              <Switch
                checked={settings.confirm}
                onCheckedChange={(confirm) =>
                  setSettings((prev) => ({ ...prev, confirm }))
                }
              />
            </label>
            <Separator />
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {copy.waSetup}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {copy.waSetupDesc}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wa-phone-id">{copy.waPhoneId}</Label>
                <Input
                  id="wa-phone-id"
                  name="wa-phone-id"
                  placeholder="106540352242922"
                  value={waPhoneId}
                  onChange={(e) => setWaPhoneId(e.target.value)}
                  className="font-mono tracking-normal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wa-token">{copy.waToken}</Label>
                <Input
                  id="wa-token"
                  name="wa-token"
                  type="password"
                  autoComplete="off"
                  placeholder="EAA…"
                  value={waToken}
                  onChange={(e) => setWaToken(e.target.value)}
                  className="font-sans tracking-normal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wa-template">{copy.waTemplate}</Label>
                <Input
                  id="wa-template"
                  name="wa-template"
                  placeholder="hello_world"
                  value={waTemplate}
                  onChange={(e) => setWaTemplate(e.target.value)}
                  className="font-mono tracking-normal"
                />
              </div>
              <Button
                type="button"
                className="w-full"
                disabled={waConnecting}
                onClick={() => void connectWhatsApp()}
              >
                {waConnecting ? copy.waConnecting : copy.waConnect}
              </Button>
              {whatsappLine.connected ? (
                <p className="text-xs text-muted-foreground">
                  {copy.waConnected}
                  {whatsappLine.from ? ` · ${formatPretty(whatsappLine.from)}` : ""}
                </p>
              ) : whatsappLine.error ? (
                <p className="text-xs text-bad">{whatsappLine.error}</p>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.saveTemplate}</DialogTitle>
            <DialogDescription>{copy.templateTitle}</DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-4">
            <Input
              id="template-title"
              name="template-title"
              placeholder={copy.templatePlaceholder}
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className="font-sans tracking-normal"
            />
            <Button type="button" className="w-full" onClick={saveTemplate}>
              <BookmarkPlus />
              {copy.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(openChannel)}
        onOpenChange={(open) => {
          if (!open) setChannelId(null);
        }}
      >
        <DialogContent>
          {openChannel ? (
            <>
              <DialogHeader>
                <DialogTitle>{openChannel.name}</DialogTitle>
                <DialogDescription>{openChannel.summary}</DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <ChannelStatusMark status={openChannel.status} />
                <p className="text-sm leading-relaxed text-foreground">
                  {openChannel.detail}
                </p>
                <div className="rounded-md bg-surface-2 px-3 py-3 shadow-border">
                  <p className="text-xs font-medium tracking-widest text-muted-foreground">
                    {copy.channelNeeds}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {openChannel.needs}
                  </p>
                </div>
                {openChannel.id === "whatsapp" ? (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      setChannelId(null);
                      setSettingsOpen(true);
                    }}
                  >
                    {copy.waSetup}
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LineBadge({
  line,
  from,
  mode,
}: {
  line: LineStatus;
  from: string;
  mode: SendMode;
}) {
  if (line.paused) {
    return (
      <Badge variant="warn" className="whitespace-nowrap">
        {copy.paused}
      </Badge>
    );
  }
  if (line.connected) {
    return (
      <Badge variant="live" className="whitespace-nowrap">
        <span className="pulse-dot" aria-hidden="true" />
        {mode === "imessage"
          ? copy.viaIMessage
          : mode === "whatsapp"
            ? copy.viaWhatsapp
            : copy.live}
        <span className="hidden sm:inline">· {formatPretty(from)}</span>
      </Badge>
    );
  }
  return (
    <Badge variant="warn" className="whitespace-nowrap">
      {line.error ? copy.offline : copy.connecting}
    </Badge>
  );
}

function ChannelStatusMark({ status }: { status: ChannelStatus }) {
  const label =
    status === "live"
      ? copy.channelLive
      : status === "provision"
        ? copy.channelProvision
        : status === "closed"
          ? copy.channelClosed
          : copy.channelPartner;
  if (status === "live") {
    return (
      <Badge variant="live" className="whitespace-nowrap">
        <span className="pulse-dot" aria-hidden="true" />
        {label}
      </Badge>
    );
  }
  if (status === "provision") {
    return <Badge variant="queued">{label}</Badge>;
  }
  return <Badge variant="warn">{label}</Badge>;
}

function StatusPill({ status }: { status: OutboxStatus }) {
  if (status === "failed") return <Badge variant="warn">{copy.failed}</Badge>;
  if (status === "paused") return <Badge variant="warn">{copy.paused}</Badge>;
  if (status === "sent") return <Badge variant="live">{copy.sent}</Badge>;
  if (status === "processed")
    return <Badge variant="queued">{copy.processed}</Badge>;
  return <Badge variant="queued">{copy.queued}</Badge>;
}
