"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/profile-data";
import { A, DimP, Spinner } from "./parts";

const USER = PROFILE.handle;
const SEARCH_URL = "https://api.github.com/search/commits";
const CACHE_MS = 2 * 60 * 1000;
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVEL_BG = [
  "color-mix(in srgb, var(--line) 70%, var(--bg))",
  "color-mix(in srgb, var(--accent) 28%, var(--bg))",
  "color-mix(in srgb, var(--accent) 50%, var(--bg))",
  "color-mix(in srgb, var(--accent) 75%, var(--bg))",
  "var(--accent)",
] as const;

type HeatDay = { date: string; count: number; future: boolean };

type SearchResponse = {
  total_count?: number;
  items?: Array<{ commit?: { author?: { date?: string } | null } | null }>;
  message?: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; counts: Map<string, number> };

let cache: { at: number; counts: Map<string, number> } | null = null;

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startSundayUtc(d: Date): Date {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  day.setUTCDate(day.getUTCDate() - day.getUTCDay());
  return day;
}

/** Last ~53 weeks, Sunday–Saturday columns, matching GitHub's calendar. */
function buildWeeks(counts: Map<string, number>, now = new Date()): HeatDay[][] {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = startSundayUtc(new Date(today.getTime() - 52 * 7 * 24 * 60 * 60 * 1000));
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const weeks: HeatDay[][] = [];
  let week: HeatDay[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 24 * 60 * 60 * 1000) {
    const d = new Date(t);
    const date = utcDay(d);
    const future = d.getTime() > today.getTime();
    week.push({ date, count: future ? 0 : (counts.get(date) ?? 0), future });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
}

function level(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  const t = count / Math.max(max, 1);
  if (t <= 0.25) return 1;
  if (t <= 0.5) return 2;
  if (t <= 0.75) return 3;
  return 4;
}

async function fetchCommitCounts(): Promise<Map<string, number>> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.counts;

  const to = new Date();
  const from = new Date(to.getTime() - 366 * 24 * 60 * 60 * 1000);
  const q = `author:${USER} author-date:${utcDay(from)}..${utcDay(to)}`;
  const counts = new Map<string, number>();
  let page = 1;
  let got = 0;
  let total = Infinity;

  while (page <= 10 && got < total) {
    const url = `${SEARCH_URL}?q=${encodeURIComponent(q)}&per_page=100&page=${page}&sort=author-date&order=desc`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" },
    });
    const data = (await res.json()) as SearchResponse;
    if (!res.ok) {
      throw new Error(data.message ?? `GitHub search failed (${res.status})`);
    }
    total = data.total_count ?? 0;
    const items = data.items ?? [];
    for (const item of items) {
      const iso = item.commit?.author?.date;
      if (!iso) continue;
      const key = utcDay(new Date(iso));
      counts.set(key, (counts.get(key) ?? 0) + 1);
      got++;
    }
    if (items.length < 100) break;
    page++;
  }

  cache = { at: Date.now(), counts };
  return counts;
}

function monthLabel(week: HeatDay[], isFirst: boolean): string | null {
  const firstOfMonth = week.find((d) => d.date.endsWith("-01"));
  if (firstOfMonth) return MONTHS[Number(firstOfMonth.date.slice(5, 7)) - 1];
  if (isFirst) return MONTHS[Number(week[0].date.slice(5, 7)) - 1];
  return null;
}

function formatDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function CommitHeatmap() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchCommitCounts()
      .then((counts) => {
        if (!cancelled) setState({ status: "ok", counts });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "failed to fetch commits",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <Spinner label="Fetching commits" />;
  }

  if (state.status === "error") {
    return <DimP>github search failed: {state.message} — try /commits again in a minute.</DimP>;
  }

  const weeks = buildWeeks(state.counts);
  let total = 0;
  let max = 0;
  for (const n of state.counts.values()) {
    total += n;
    if (n > max) max = n;
  }

  return (
    <div className="space-y-3">
      <p>
        {total} public commit{total === 1 ? "" : "s"} in the last year
      </p>
      <div className="overflow-x-auto overflow-y-hidden">
        <div
          role="img"
          aria-label={`${total} public commits by ${USER} in the last year`}
          className="inline-flex gap-1.5"
        >
          <div className="flex shrink-0 flex-col gap-[2px] pt-4">
            {WEEKDAYS.map((label, i) => (
              <span key={i} className="h-[10px] text-[9px] leading-[10px] text-dim">
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-col">
            <div className="mb-1 flex gap-[2px]">
              {weeks.map((week, i) => (
                <span
                  key={week[0].date}
                  className="h-3 w-[10px] shrink-0 overflow-visible whitespace-nowrap text-[9px] leading-3 text-dim"
                >
                  {monthLabel(week, i === 0) ?? ""}
                </span>
              ))}
            </div>
            <div className="flex gap-[2px]">
              {weeks.map((week) => (
                <div key={week[0].date} className="flex flex-col gap-[2px]">
                  {week.map((day) => {
                    const lv = level(day.count, max);
                    const label = day.future
                      ? undefined
                      : `${day.count} commit${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`;
                    return (
                      <div
                        key={day.date}
                        data-date={day.date}
                        data-count={day.count}
                        data-level={lv}
                        title={label}
                        aria-label={label}
                        className="size-[10px]"
                        style={{ background: LEVEL_BG[lv], opacity: day.future ? 0.35 : 1 }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-dim">
        <span>Less</span>
        <span className="flex gap-[2px]">
          {LEVEL_BG.map((bg, i) => (
            <span key={i} className="size-[10px]" style={{ background: bg }} />
          ))}
        </span>
        <span>More</span>
        <span className="text-dim/70">·</span>
        <A href={PROFILE.github}>github.com/{USER}</A>
      </div>
      <DimP>live from api.github.com · public commits only</DimP>
    </div>
  );
}
