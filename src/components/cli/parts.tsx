"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

/* ============================================================
   Shared presentational parts — styled after modern coding-agent CLIs.
   ============================================================ */

export const SPINNER_FRAMES = ["·", "✢", "✳", "✶", "✻", "✽"];
const PAST_VERBS = ["Brewed", "Baked", "Shipped", "Wired", "Compiled", "Debugged"];
export const THINKING_VERBS = [
  "Brewing",
  "Compiling",
  "Contemplating",
  "Simulating",
  "Planning",
  "Optimizing kinematics",
  "Reticulating splines",
];

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** ✻ spinner, ping-pong cycling; static ● under reduced motion */
export function Spinner({ label }: { label?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    // ping-pong: forward then backward through the frame set
    const t = setInterval(() => {
      setI((prev) => {
        const cycle = SPINNER_FRAMES.length * 2 - 2;
        const step = (prev + 1) % cycle;
        return step;
      });
    }, 110);
    return () => clearInterval(t);
  }, [reduced]);

  const frame = reduced
    ? "●"
    : SPINNER_FRAMES[i < SPINNER_FRAMES.length ? i : SPINNER_FRAMES.length * 2 - 2 - i];

  return (
    <span className="inline-flex items-center gap-2 text-accent">
      <span className="inline-block w-3 text-center">{frame}</span>
      {label && <span className="text-text">{label}…</span>}
    </span>
  );
}

export function pastVerb() {
  return pick(PAST_VERBS);
}

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_MQ).matches,
    () => false
  );
}

/* ============================================================
   Ask-user-question — Claude Code / Codex style picker.
   Purely presentational: selection state is owned by the app,
   which swaps this in FOR the composer while it's pending.
   ============================================================ */

export interface AskOption {
  label: string;
  desc?: string;
}

export function AskMessage({
  prompt,
  options,
  selectedIdx = 0,
  answered,
}: {
  prompt: string;
  options: AskOption[];
  selectedIdx?: number;
  /** chosen label, or null while pending */
  answered?: string | null;
}) {
  const answeredText = answered ?? null;
  return (
    <div className="w-fit max-w-full border border-line bg-panel px-4 py-3 font-mono text-sm sm:text-base">
      <p className={answeredText ? "text-dim" : "text-text"}>{prompt}</p>
      <div className="mt-2 space-y-0.5">
        {options.map((o, i) => {
          const selected = i === selectedIdx && !answeredText;
          return (
            <div
              key={o.label}
              className={`flex items-baseline gap-1.5 whitespace-pre ${
                answeredText ? "text-dim" : selected ? "text-accent" : "text-text"
              }`}
            >
              <span aria-hidden="true" className="w-4 select-none">
                {selected ? "❯" : " "}
              </span>
              <span className="select-none tabular-nums text-dim">{i + 1}.</span>
              <span className={answeredText || !selected ? "" : "font-medium"}>
                {o.label}
                {answeredText && answeredText === o.label ? (
                  <span className="ml-2 text-accent">✓</span>
                ) : null}
              </span>
              {o.desc && <span className="text-dim">— {o.desc}</span>}
            </div>
          );
        })}
      </div>
      {!answeredText && (
        <p className="mt-2.5 border-t border-line pt-2 text-xs text-dim">
          enter to select · ↑↓ navigate · numbers quick-pick
        </p>
      )}
    </div>
  );
}

/* ---------- ASCII welcome ---------- */

const WELCOME_ART = [
  "██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗",
  "██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝",
  "██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  ",
  "██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  ",
  "╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗",
  " ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝",
];

export function Banner() {
  return (
    <figure className="overflow-x-auto font-mono" aria-label="welcome">
      <pre
        aria-hidden="true"
        className="select-none whitespace-pre text-accent/90 leading-[1.15]"
        style={{ fontSize: "clamp(4.5px, 1.9vw, 14px)" }}
      >
        {WELCOME_ART.join("\n")}
      </pre>
    </figure>
  );
}

/* ---------- Codex-style tips: bold command + dim description ---------- */

export function Tips({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="font-mono text-sm sm:text-base">
      <p className="mb-2 text-dim">To get started, describe a task or try one of these commands:</p>
      <div className="space-y-1">
        {items.map(([cmd, desc]) => (
          <p key={cmd}>
            <span className="font-semibold text-text">{cmd}</span>
            <span className="text-dim"> - {desc}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------- message renderers ---------- */

export function UserMsg({ text }: { text: string }) {
  return (
    <div className="border-l-2 border-user bg-accent/[0.06] px-3.5 py-2 font-mono text-sm sm:text-base">
      <span className="whitespace-pre-wrap break-words text-text">{text}</span>
    </div>
  );
}

export function ToolCall({ call, out }: { call: string; out?: string[] }) {
  const m = /^(\w+)\((.*)\)$/.exec(call);
  const name = m?.[1] ?? call;
  const args = m?.[2] ?? "";
  return (
    <div className="space-y-1 font-mono text-sm sm:text-base">
      <p className="break-all">
        <span className="mr-2 text-accent">●</span>
        <span className="font-medium text-text">{name}</span>
        <span className="text-dim">({args})</span>
      </p>
      {out?.map((line, i) => (
        <p key={i} className="whitespace-pre-wrap break-words pl-6 text-dim">
          <span className="mr-1.5 opacity-70">⎿</span>
          <span className={i === 0 ? "text-text/80" : undefined}>{line}</span>
        </p>
      ))}
    </div>
  );
}

export function Reply({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 font-mono text-sm leading-relaxed sm:text-base">
      <span aria-hidden="true" className="mt-px shrink-0 text-accent">
        ●
      </span>
      <div className="min-w-0 flex-1 space-y-3">{children}</div>
    </div>
  );
}

/** stark xAI-flavored section header */
export function H({ children }: { children: ReactNode }) {
  return <p className="pt-1 text-xs font-bold uppercase tracking-[0.25em] text-text">{children}</p>;
}

export function A({
  href,
  children,
  external = true,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="underline decoration-line decoration-dotted underline-offset-4 transition-colors hover:bg-accent/15 hover:decoration-accent"
    >
      {children}
    </a>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="border border-line px-1.5 py-0.5 text-xs text-text/90">{children}</span>;
}

export function DimP({ children }: { children: ReactNode }) {
  return <p className="text-dim">{children}</p>;
}
