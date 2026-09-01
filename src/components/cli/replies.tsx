"use client";

import type { ReactNode } from "react";
import { ABOUT, NEOFETCH_ART, OPEN_SOURCE, PROFILE, SKILLS } from "@/lib/profile-data";
import { ContributionHeatmap } from "./commits-heatmap";
import { A, Chip, DimP, H, Reply } from "./parts";

export type Msg =
  | { kind: "user"; text: string }
  | { kind: "tool"; call: string; out?: string[] }
  | { kind: "reply"; node: ReactNode }
  | { kind: "turn"; verb: string; secs: string }
  | {
      kind: "ask";
      id: string;
      question: string;
      options: Array<{ label: string; desc?: string; value: string }>;
    }
  | { kind: "game"; id: string };

export interface ReplyCtx {
  clear(): void;
  startMatrix(): void;
}

function tool(call: string, out?: string[]): Msg {
  return { kind: "tool", call, out };
}

function reply(node: ReactNode): Msg {
  return { kind: "reply", node };
}

/* ---------- content builders ---------- */

function aboutReply() {
  return reply(
    <Reply>
      <div className="max-w-prose space-y-2">
        {ABOUT.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <DimP>
        status: <span className="text-accent">open to interesting problems</span> — try /contact
      </DimP>
    </Reply>
  );
}

function skillsReply() {
  return [
    tool("Read(~/skills.json)", ["4 groups · parsed OK"]),
    reply(
      <Reply>
        <H>Skill Matrix</H>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {SKILLS.map((group) => (
            <div key={group.group}>
              <p className="mb-1.5 text-xs uppercase tracking-widest text-dim">{group.group}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reply>
    ),
  ];
}

function projectsReply(): Msg[] {
  return [
    tool("Bash(git log --open-source --author=guest)", ["1 repo · patches landed upstream"]),
    reply(
      <Reply>
        <H>Open Source</H>
        {OPEN_SOURCE.map((repo) => (
          <div key={repo.name} className="space-y-1">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://omp.sh/favicon.svg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="size-5 shrink-0 self-center"
              />
              <A href={repo.url}>
                <span className="font-semibold text-text">{repo.name}</span>
              </A>
              <span className="text-dim">@{repo.author}</span>
              <span className="bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                {repo.role}
              </span>
              <span className="text-dim">★ {repo.stars}</span>
            </p>
            <p>{repo.tagline}</p>
            <p className="max-w-prose text-dim">{repo.description}</p>
          </div>
        ))}

        <H>Personal</H>
        <div className="space-y-1">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium text-text">personal/experiments</span>
            <span className="bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              building
            </span>
          </p>
          <p className="text-dim">
            compiling ideas into binaries — ETA: whenever the coffee holds.
          </p>
        </div>
      </Reply>
    ),
  ];
}

function contactReply() {
  return [
    tool("Bash(ping voonfoo.dev)", ["64 bytes: reachable · latency < 24h"]),
    reply(
      <Reply>
        <H>Contact</H>
        <div className="space-y-1">
          <p>
            <span className="inline-block w-24 text-dim">email</span>
            <A href={`mailto:${PROFILE.email}`} external={false}>
              {PROFILE.email}
            </A>
          </p>
          <p>
            <span className="inline-block w-24 text-dim">github</span>
            <A href={PROFILE.github}>{PROFILE.github.replace("https://", "")}</A>
          </p>
          <p>
            <span className="inline-block w-24 text-dim">linkedin</span>
            <A href={PROFILE.linkedin}>linkedin/in/{PROFILE.handle}</A>
          </p>
          <p>
            <span className="inline-block w-24 text-dim">location</span>
            {PROFILE.location}
          </p>
        </div>
        <DimP>faster response if you mention robots. it&apos;s a filter, not a bug.</DimP>
      </Reply>
    ),
  ];
}

function neofetchReply() {
  const rows: Array<[string, ReactNode]> = [
    ["OS", <>Linux (emotionally)</>],
    ["Host", <>{PROFILE.host}</>],
    ["Kernel", <>6.2.motion-planning</>],
    ["Shell", <>vsh · agentic</>],
    ["Uptime", <>since first hello world</>],
    ["CPU", <>Human Cortex v2 @ 100W</>],
    ["Memory", <>640K (enough for anyone)</>],
  ];
  return [
    tool("Bash(neofetch --profile)"),
    reply(
      <Reply>
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
          <pre className="shrink-0 text-xs leading-tight text-accent/90 sm:text-sm">
            {NEOFETCH_ART.join("\n")}
          </pre>
          <div className="space-y-0.5 self-center">
            <p className="font-medium text-text">guest@{PROFILE.host}</p>
            <p className="whitespace-pre text-dim">{"─".repeat(24)}</p>
            {rows.map(([k, v]) => (
              <p key={k}>
                <span className="inline-block w-20 text-dim">{k}</span>
                {v}
              </p>
            ))}
          </div>
        </div>
      </Reply>
    ),
  ];
}

/* ---------- registry ---------- */

export interface Command {
  name: string;
  desc: string;
  run(args: string[], ctx: ReplyCtx): Msg[];
}

export function buildCommands(): Command[] {
  return [
    {
      name: "help",
      desc: "show this command list",
      run: () => [
        reply(
          <Reply>
            <H>Commands</H>
            <div className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1">
              {buildCommands().map((c) => (
                <span key={c.name} className="contents">
                  <span className="font-semibold text-text">/{c.name}</span>
                  <span className="text-dim">{c.desc}</span>
                </span>
              ))}
            </div>
            <DimP>
              plain questions work too — try &quot;who are you?&quot; or &quot;can he build my
              robot?&quot;
            </DimP>
          </Reply>
        ),
      ],
    },
    { name: "about", desc: "who is behind this terminal", run: () => [aboutReply()] },
    {
      name: "games",
      desc: "pick a game to play",
      run: () => [
        tool("Bash(ls /usr/games)", ["snake"]),
        {
          kind: "ask",
          id: `games-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
          question: "which game?",
          options: [{ label: "Snake", desc: "the classic. eat, grow, regret.", value: "snake" }],
        },
      ],
    },
    { name: "skills", desc: "dump the skill matrix", run: () => skillsReply() },
    { name: "projects", desc: "current build queue", run: () => projectsReply() },
    {
      name: "commits",
      desc: "github contribution heatmap",
      run: () => [
        tool("WebFetch(github.com/users/voonfoo/contributions)", [
          "contribution calendar · last 12 months",
        ]),
        reply(
          <Reply>
            <H>Contributions</H>
            <ContributionHeatmap />
          </Reply>
        ),
      ],
    },
    { name: "contact", desc: "open a channel", run: () => contactReply() },
    {
      name: "socials",
      desc: "github · linkedin",
      run: () => [
        tool("WebFetch(socials)"),
        reply(
          <Reply>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <A href={PROFILE.github}>github/{PROFILE.handle}</A>
              <A href={PROFILE.linkedin}>linkedin/in/{PROFILE.handle}</A>
            </div>
          </Reply>
        ),
      ],
    },
    { name: "neofetch", desc: "system info, but personal", run: () => neofetchReply() },
    {
      name: "clear",
      desc: "wipe the transcript",
      run: (_args, ctx) => {
        ctx.clear();
        return [];
      },
    },
    {
      name: "phosphor",
      desc: "you know what this does",
      run: (args, ctx) => {
        ctx.startMatrix();
        return [
          reply(
            <Reply>
              <p>wake up…</p>
            </Reply>
          ),
        ];
      },
    },
    {
      name: "coffee",
      desc: "essential dependency",
      run: () => [
        tool("Bash(brew --strong)"),
        reply(
          <Reply>
            <pre className="text-accent/90">{String.raw`
      ( (
       ) )
    ........
    |      |]
    \      /
     '----'
`}</pre>
            <DimP>productivity +20%. jitters +80%. worth it.</DimP>
          </Reply>
        ),
      ],
    },
    {
      name: "sudo",
      desc: "try your luck",
      run: (args) => {
        const joined = args.join(" ");
        if (/hire|employ|recruit/.test(joined)) {
          return [
            tool("Auth(escalate)", ["root access granted ✓"]),
            reply(
              <Reply>
                <p>
                  <span className="text-accent">PRIVILEGE ESCALATION GRANTED.</span> smart move.
                </p>
                <p>
                  continue at{" "}
                  <A href={`mailto:${PROFILE.email}`} external={false}>
                    {PROFILE.email}
                  </A>
                </p>
              </Reply>
            ),
          ];
        }
        if (/rm\s+-rf\s+\//.test(joined)) {
          return [
            tool("Bash(rm -rf /)", ["permission denied: vibes protection enabled"]),
            reply(
              <Reply>
                <p>nice try. this filesystem is load-bearing.</p>
              </Reply>
            ),
          ];
        }
        return [
          reply(
            <Reply>
              <p>guest is not in the sudoers file. this incident will be reported to /dev/null.</p>
            </Reply>
          ),
        ];
      },
    },
    {
      name: "exit",
      desc: "not recommended",
      run: () => [
        reply(
          <Reply>
            <p>logout</p>
            <p className="text-dim">
              Connection to {PROFILE.host} closed… just kidding. you&apos;re stuck here. try /help.
            </p>
          </Reply>
        ),
      ],
    },
  ];
}

/* ---------- natural-language intents ---------- */

export function intentReply(input: string): Msg[] | null {
  const q = input.toLowerCase();
  if (/^(hi|hello|hey|yo|sup|hallo)\b/.test(q)) {
    return [
      reply(
        <Reply>
          <p>
            hey. welcome. ask me anything about Voon — or hit{" "}
            <span className="font-semibold">/help</span>.
          </p>
        </Reply>
      ),
    ];
  }
  if (/who are you|about you|introduce|yourself/.test(q)) return [aboutReply()];
  if (/skill|stack|tech|language/.test(q)) return skillsReply();
  if (/project|build(ed)?|work|repo/.test(q)) return projectsReply();
  if (/contact|email|reach|hiring|hire|available|job/.test(q)) return contactReply();
  if (/robot|robotics|motion|simulat/.test(q)) {
    return [
      reply(
        <Reply>
          <p>yes. simulation, motion planning, inverse kinematics — the whole robot stack.</p>
          <DimP>evidence: /skills · receipts: /projects</DimP>
        </Reply>
      ),
    ];
  }
  if (/thank|thanks|thx/.test(q)) {
    return [
      reply(
        <Reply>
          <p>anytime. ♨</p>
        </Reply>
      ),
    ];
  }
  return null;
}

export function fallbackReply(input: string): Msg[] {
  return [
    tool('Grep(pattern="' + input.slice(0, 32) + '")', ["no direct match in ~/voonfoo"]),
    reply(
      <Reply>
        <p>not sure how to parse that one. try:</p>
        <p className="text-dim">
          <span className="font-semibold text-text">/help</span> for commands, or ask about{" "}
          <span className="text-text">skills</span>, <span className="text-text">projects</span>,{" "}
          <span className="text-text">contact</span>.
        </p>
      </Reply>
    ),
  ];
}
