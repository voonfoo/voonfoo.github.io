"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { MatrixRain } from "./matrix-rain";
import {
  Banner,
  Reply,
  Spinner,
  Tips,
  ToolCall,
  THINKING_VERBS,
  UserMsg,
  pastVerb,
  pick,
} from "./parts";
import { buildCommands, fallbackReply, intentReply, type Msg } from "./replies";

/* ============================================================
   Agentic terminal UI — a mix of modern coding-agent CLIs.
   ============================================================ */

/* ---------- component ---------- */

export function CliExperience() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinkingVerb, setThinkingVerb] = useState("");
  const [slashIdx, setSlashIdx] = useState(0);
  const [matrixActive, setMatrixActive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const draftRef = useRef("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo(() => buildCommands(), []);

  /* autoscroll */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs, busy]);

  /* focus */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ---------- slash popup state ---------- */

  const slashQuery = input.startsWith("/") ? input.slice(1).toLowerCase() : null;
  const matches = useMemo(() => {
    if (slashQuery === null) return [];
    return commands.filter((c) => c.name.startsWith(slashQuery));
  }, [slashQuery, commands]);
  const popupOpen = slashQuery !== null && !input.includes(" ");
  const safeSlashIdx = Math.min(slashIdx, Math.max(0, matches.length - 1));

  // reset popup selection when the query changes (render-phase adjustment)
  const [prevQuery, setPrevQuery] = useState(slashQuery);
  if (prevQuery !== slashQuery) {
    setPrevQuery(slashQuery);
    setSlashIdx(0);
  }

  /* ---------- select-to-copy (terminal-style) ---------- */

  const [toast, setToast] = useState<{ chars: number } | null>(null);
  const toastTimer = useRef<number | null>(null);

  const onTranscriptMouseUp = useCallback(async () => {
    const text = window.getSelection()?.toString() ?? "";
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // clipboard unavailable (permissions/insecure context)
    }
    setToast({ chars: text.length });
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    },
    []
  );

  /* ---------- submit ---------- */

  const submit = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      const t0 = Date.now();
      const userMsg: Msg = { kind: "user", text };
      setMsgs((prev) => [...prev, userMsg]);
      setHistory((prev) => [...prev.slice(-49), text]);
      setInput("");
      setBusy(true);
      setThinkingVerb(pick(THINKING_VERBS));

      let out: Msg[];
      if (text.startsWith("/")) {
        const [name, ...args] = text.slice(1).split(/\s+/);
        const cmd = commands.find((c) => c.name === name);
        out = cmd
          ? cmd.run(args, { clear: () => setMsgs([]), startMatrix: () => setMatrixActive(true) })
          : [
              {
                kind: "reply",
                node: (
                  <Reply>
                    <p>
                      unknown command <span className="font-semibold">/{name}</span> — try{" "}
                      <span className="font-semibold">/help</span>
                    </p>
                  </Reply>
                ),
              } satisfies Msg,
            ];
      } else {
        out = intentReply(text) ?? fallbackReply(text);
      }

      window.setTimeout(
        () => {
          setMsgs((prev) => [
            ...prev,
            ...out,
            { kind: "turn", verb: pastVerb(), secs: ((Date.now() - t0) / 1000).toFixed(1) },
          ]);
          setBusy(false);
        },
        500 + Math.random() * 450
      );
    },
    [busy, commands]
  );

  /* ---------- composer keys ---------- */

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (popupOpen && matches.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIdx((i) => (i + 1) % matches.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIdx((i) => (i - 1 + matches.length) % matches.length);
        return;
      }
      // fully-typed command: Enter sends it straight away
      const isExact = slashQuery !== null && matches[0]?.name === slashQuery;
      if (isExact && e.key === "Enter") {
        e.preventDefault();
        submit(input);
        return;
      }
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        setInput(`/${matches[safeSlashIdx].name} `);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setInput("");
        return;
      }
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        submit(input);
        break;
      case "ArrowUp":
        if (!history.length) return;
        e.preventDefault();
        if (histIdx === null) draftRef.current = input;
        const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(idx);
        setInput(history[idx]);
        break;
      case "ArrowDown":
        if (histIdx === null) return;
        e.preventDefault();
        if (histIdx + 1 >= history.length) {
          setHistIdx(null);
          setInput(draftRef.current);
        } else {
          setHistIdx(histIdx + 1);
          setInput(history[histIdx + 1]);
        }
        break;
      case "Escape":
        if (!popupOpen) {
          setHistIdx(null);
        }
        break;
    }
  };

  const turnCount = msgs.filter((m) => m.kind === "turn").length;
  const ctxPct = Math.max(84, 99 - turnCount);
  const meterCells = Math.round((ctxPct / 100) * 10);
  const meter = "█".repeat(meterCells) + "░".repeat(10 - meterCells);

  return (
    <div className="flex h-dvh flex-col bg-bg text-text">
      {/* transcript */}
      <main
        ref={scrollRef}
        onMouseUp={onTranscriptMouseUp}
        className="min-h-0 flex-1 overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
          <div className="msg-in">
            <Banner />
          </div>
          <div className="msg-in px-1" style={{ animationDelay: "80ms" }}>
            <Tips
              items={[
                ["/about", "who is behind this terminal"],
                ["/skills", "dump the skill matrix"],
                ["/projects", "current build queue"],
                ["/contact", "open a channel"],
              ]}
            />
          </div>

          {msgs.map((m, i) => {
            switch (m.kind) {
              case "user":
                return <UserMsg key={i} text={m.text} />;
              case "tool":
                return <ToolCall key={i} call={m.call} out={m.out} />;
              case "reply":
                return <div key={i}>{m.node}</div>;
              case "turn":
                return (
                  <p key={i} className="font-mono text-xs text-accent/90 sm:text-sm">
                    ✻ {m.verb} for {m.secs}s
                  </p>
                );
            }
          })}

          {busy && (
            <div className="pl-0.5 font-mono text-sm sm:text-base">
              <Spinner label={thinkingVerb} />
            </div>
          )}
        </div>
      </main>

      {/* composer */}
      <div className="shrink-0 px-4 pb-2 sm:px-6">
        <div className="relative mx-auto max-w-3xl">
          {/* slash popup */}
          {popupOpen && matches.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden border border-line bg-panel shadow-xl shadow-black/40">
              {matches.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onMouseEnter={() => setSlashIdx(i)}
                  onClick={() => setInput(`/${c.name} `)}
                  className={`flex w-full items-baseline gap-3 px-4 py-2 text-left font-mono text-sm ${
                    i === safeSlashIdx ? "bg-accent/15" : ""
                  }`}
                >
                  <span
                    className={`w-24 shrink-0 ${i === safeSlashIdx ? "text-accent" : "text-text"}`}
                  >
                    /{c.name}
                  </span>
                  <span className="truncate text-dim">{c.desc}</span>
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border border-line bg-panel transition-colors focus-within:border-accent/50"
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  busy ? `${thinkingVerb.toLowerCase()}…` : "Type a message or /command…"
                }
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label="Message input"
                className="w-full bg-transparent font-mono text-base text-text caret-accent outline-none placeholder:text-dim/60"
              />
            </div>
          </form>

          {/* footer hints + context meter */}
          <div className="flex items-center justify-between gap-4 px-1 pt-1.5 font-mono text-[11px] text-dim">
            <p className="truncate">
              <span className="hidden sm:inline">⏎ send · ↑ history · </span>/help commands
            </p>
            <p className="shrink-0 tabular-nums tracking-tight">
              context <span className="text-accent/80">{meter}</span> {ctxPct}%
            </p>
          </div>
        </div>
      </div>

      {/* copy toast */}
      {toast && (
        <div
          role="status"
          className="msg-in fixed right-4 top-4 z-50 border border-accent/40 bg-accent/15 px-3.5 py-2 font-mono text-xs text-text backdrop-blur-sm sm:text-sm"
        >
          <span className="mr-1.5 text-accent">✓</span>
          Copied <span className="font-semibold text-accent">{toast.chars}</span> chars
        </div>
      )}

      {matrixActive && <MatrixRain onDone={() => setMatrixActive(false)} />}
    </div>
  );
}
