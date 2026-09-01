"use client";

import { useEffect, useState } from "react";
import type { ContributionCalendar, ContributionDay } from "@/lib/contributions";
import { PROFILE } from "@/lib/profile-data";
import { A, DimP, Spinner } from "./parts";

const USER = PROFILE.handle;
const CALENDAR_JSON = "/contributions.json";
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVEL_BG = [
  "color-mix(in srgb, var(--line) 70%, var(--bg))",
  "color-mix(in srgb, var(--accent) 28%, var(--bg))",
  "color-mix(in srgb, var(--accent) 50%, var(--bg))",
  "color-mix(in srgb, var(--accent) 75%, var(--bg))",
  "var(--accent)",
] as const;

type HeatDay = ContributionDay & { future: boolean };

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; calendar: ContributionCalendar };

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseISODateUTC(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function clampLevel(n: number): 0 | 1 | 2 | 3 | 4 {
  const i = Math.max(0, Math.min(4, Math.round(n)));
  return i as 0 | 1 | 2 | 3 | 4;
}

/** Sunday–Saturday columns from the baked calendar, padding the current week. */
function buildWeeks(days: ContributionDay[]): HeatDay[][] {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const sorted = [...byDate.keys()].sort();
  if (!sorted.length) return [];

  const first = parseISODateUTC(sorted[0]);
  const last = parseISODateUTC(sorted[sorted.length - 1]);
  const start = new Date(first);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = new Date(last);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
  const lastKey = sorted[sorted.length - 1];

  const weeks: HeatDay[][] = [];
  let week: HeatDay[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 24 * 60 * 60 * 1000) {
    const date = utcDay(new Date(t));
    const rec = byDate.get(date);
    const future = date > lastKey;
    week.push({
      date,
      count: rec?.count ?? 0,
      level: rec?.level ?? 0,
      future,
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
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

function contribWord(n: number): string {
  return n === 1 ? "contribution" : "contributions";
}

export function ContributionHeatmap() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const ac = new AbortController();
    fetch(CALENDAR_JSON, { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "calendar not baked yet"
              : `failed to load calendar (${res.status})`
          );
        }
        const data = (await res.json()) as ContributionCalendar;
        if (!Array.isArray(data.days) || data.days.length === 0) {
          throw new Error("calendar JSON has no days");
        }
        setState({ status: "ok", calendar: data });
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "failed to load calendar",
        });
      });
    return () => ac.abort();
  }, []);

  if (state.status === "loading") {
    return <Spinner label="Fetching contributions" />;
  }

  if (state.status === "error") {
    return <DimP>contribution calendar unavailable: {state.message}</DimP>;
  }

  const { calendar } = state;
  const weeks = buildWeeks(calendar.days);
  const total = calendar.total;

  return (
    <div className="space-y-3">
      <p>
        {total.toLocaleString("en-US")} {contribWord(total)} in the last year
      </p>
      <div className="overflow-x-auto overflow-y-hidden">
        <div
          role="img"
          aria-label={`${total.toLocaleString("en-US")} ${contribWord(total)} by ${USER} in the last year`}
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
                    const lv = clampLevel(day.level);
                    const label = day.future
                      ? undefined
                      : `${day.count} ${contribWord(day.count)} on ${formatDay(day.date)}`;
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
      <DimP>github contribution calendar · private activity included as day counts</DimP>
    </div>
  );
}
