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
  getSmsLine,
  getSmsStatus,
  listSmsHistory,
  sendSms,
} from "@/lib/sms/api";
import {
  DRAFT_KEY,
  FROM_NUMBER,
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
import {
  formatPretty,
  nameTokensOk,
  parseRecipients,
  recipientsIssue,
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
};

type Person = { id: string; name: string; phone: string };
type Template = { id: string; title: string; text: string };
type SettingsState = { signature: string; confirm: boolean };

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

const FALLBACK_LINE: LineStatus = {
  connected: false,
  from: FROM_NUMBER,
  paused: false,
};

const DEFAULT_SETTINGS: SettingsState = { signature: "", confirm: true };

export function SmsStudio({ initialLine }: { initialLine?: LineStatus }) {
  const seed = initialLine ?? FALLBACK_LINE;
  const [line, setLine] = useState<LineStatus>(seed);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [shake, setShake] = useState(false);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
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
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    const draft = readJson<{ to?: string; text?: string }>(DRAFT_KEY, {});
    setTo(typeof draft.to === "string" ? draft.to : "");
    setText(typeof draft.text === "string" ? draft.text : "");
    const storedOutbox = readJson<OutboxItem[]>(OUTBOX_KEY, []);
    setOutbox(Array.isArray(storedOutbox) ? storedOutbox : []);
    const storedPeople = readJson<Person[]>(PEOPLE_KEY, []);
    setPeople(Array.isArray(storedPeople) ? storedPeople : []);
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
    getSmsLine()
      .then((status) => {
        if (!cancelled) setLine(status);
      })
      .catch(() => {
        if (!cancelled && !seed.connected) {
          setLine({
            connected: false,
            from: FROM_NUMBER,
            paused: false,
            error: copy.offlineErr,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [seed.connected]);

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
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ to, text }));
  }, [hydrated, to, text]);

  const from = line.from || FROM_NUMBER;
  const issue = recipientsIssue(to);
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
        data: { to: recipients, text: body, names },
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

  async function refreshStatus(item: OutboxItem) {
    if (!item.messageId) {
      toast.error(copy.noId);
      return;
    }
    setCheckingId(item.id);
    try {
      const result = await getSmsStatus({
        data: { messageId: item.messageId },
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
                segments: result.segmentCount ?? row.segments,
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
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      let added = 0;
      setOutbox((prev) => {
        const have = new Set(
          prev.map((item) => item.messageId).filter(Boolean),
        );
        const extra: OutboxItem[] = [];
        for (const remote of result.messages) {
          if (have.has(remote.id)) continue;
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
          });
        }
        return [...extra, ...prev].slice(0, OUTBOX_LIMIT);
      });
      toast.success(copy.historyOk(added));
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
          <LineBadge line={line} from={from} />
        </div>
      </header>

      <p className="stagger-in mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
        {copy.tagline(formatPretty(from))}
      </p>

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

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="to">{copy.to}</Label>
              <Input
                id="to"
                name="to"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={copy.toPlaceholder}
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
                        ? `${known ? `${known.name} · ` : ""}${formatPretty(primary)}`
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
                  {info.segments > 1 ? copy.sendN(info.segments) : copy.send}
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
                      <StatusPill status={item.status} />
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
    </div>
  );
}

function LineBadge({ line, from }: { line: LineStatus; from: string }) {
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
        {copy.live}
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

function StatusPill({ status }: { status: OutboxStatus }) {
  if (status === "failed") return <Badge variant="warn">{copy.failed}</Badge>;
  if (status === "paused") return <Badge variant="warn">{copy.paused}</Badge>;
  if (status === "sent") return <Badge variant="live">{copy.sent}</Badge>;
  if (status === "processed")
    return <Badge variant="queued">{copy.processed}</Badge>;
  return <Badge variant="queued">{copy.queued}</Badge>;
}
