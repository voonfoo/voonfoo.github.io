/**
 * Bake github.com/users/voonfoo/contributions into public/contributions.json.
 * Run at Pages deploy (and locally). Do not commit the JSON — cron commits
 * would paint extra squares on the calendar we are mirroring.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ContributionCalendar, ContributionDay } from "../src/lib/contributions";

const USER = "voonfoo";
const CALENDAR_URL = `https://github.com/users/${USER}/contributions`;
const GRAPHQL_URL = "https://api.github.com/graphql";
const UA = `voonfoo.github.io contribution-calendar (+https://github.com/${USER}/${USER}.github.io)`;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "contributions.json");
const MIN_DAYS = 300;

const LEVEL_FROM_GQL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function clampLevel(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(4, Math.round(n)));
}

function attr(tag: string, name: string): string | null {
  const dq = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  if (dq) return dq[1];
  const sq = tag.match(new RegExp(`\\b${name}='([^']*)'`));
  return sq ? sq[1] : null;
}

function parseCount(tip: string): number | null {
  const t = tip
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (/^no contributions\b/i.test(t)) return 0;
  const m = t.match(/^([\d,]+)\s+contributions?\b/i);
  if (!m) return null;
  return Number.parseInt(m[1].replace(/,/g, ""), 10);
}

function assemble(days: ContributionDay[], headingTotal: number | null): ContributionCalendar {
  const unique = new Map<string, ContributionDay>();
  for (const day of days) unique.set(day.date, day);
  const sorted = [...unique.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < MIN_DAYS) {
    throw new Error(`calendar too short (${sorted.length} days)`);
  }
  const sum = sorted.reduce((n, d) => n + d.count, 0);
  if (headingTotal != null && headingTotal !== sum) {
    console.warn(`heading total ${headingTotal} != day sum ${sum}; using heading`);
  }
  return {
    user: USER,
    total: headingTotal ?? sum,
    from: sorted[0].date,
    to: sorted[sorted.length - 1].date,
    fetchedAt: new Date().toISOString(),
    days: sorted,
  };
}

export function parseContributionHtml(html: string): ContributionCalendar {
  if (
    /id=["']security-login["']/.test(html) ||
    /name=["']captcha["']/i.test(html) ||
    /\bJust a moment\b/.test(html)
  ) {
    throw new Error("contributions HTML looks blocked (login/captcha)");
  }

  const heading = html.match(/([\d,]+)\s+contributions\s+in the last year/i);
  const headingTotal = heading ? Number.parseInt(heading[1].replace(/,/g, ""), 10) : null;

  const cellRe =
    /<td\b([^>]*\bContributionCalendar-day\b[^>]*)>(?:\s*)<\/td>\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/gi;
  const days: ContributionDay[] = [];
  let m: RegExpExecArray | null;
  while ((m = cellRe.exec(html))) {
    const date = attr(m[1], "data-date");
    const levelRaw = attr(m[1], "data-level");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || levelRaw == null) continue;
    const count = parseCount(m[2]);
    if (count == null || !Number.isFinite(count)) {
      throw new Error(`unparsed tooltip for ${date}: ${m[2].trim()}`);
    }
    days.push({ date, count, level: clampLevel(Number.parseInt(levelRaw, 10)) });
  }

  if (days.length < MIN_DAYS) {
    throw new Error(`failed to parse contribution cells (${days.length})`);
  }
  return assemble(days, headingTotal);
}

async function scrapeCalendar(): Promise<ContributionCalendar> {
  const res = await fetch(CALENDAR_URL, {
    headers: {
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": UA,
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`GET ${CALENDAR_URL} failed (${res.status})`);
  }
  const html = await res.text();
  return parseContributionHtml(html);
}

type GqlResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number;
          weeks?: Array<{
            contributionDays?: Array<{
              date?: string;
              contributionCount?: number;
              contributionLevel?: string;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message?: string }>;
};

async function graphqlCalendar(token: string): Promise<ContributionCalendar> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": UA,
    },
    body: JSON.stringify({
      query: `query ($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }`,
      variables: { login: USER },
    }),
    signal: AbortSignal.timeout(30_000),
  });
  const body = (await res.json()) as GqlResponse;
  if (!res.ok) {
    throw new Error(`GraphQL failed (${res.status})`);
  }
  if (body.errors?.length) {
    throw new Error(body.errors[0]?.message ?? "GraphQL error");
  }
  const cal = body.data?.user?.contributionsCollection?.contributionCalendar;
  const days: ContributionDay[] = [];
  for (const week of cal?.weeks ?? []) {
    for (const d of week.contributionDays ?? []) {
      if (!d.date) continue;
      days.push({
        date: d.date,
        count: d.contributionCount ?? 0,
        level: clampLevel(LEVEL_FROM_GQL[d.contributionLevel ?? ""] ?? 0),
      });
    }
  }
  return assemble(days, cal?.totalContributions ?? null);
}

async function loadCalendar(): Promise<{ calendar: ContributionCalendar; via: string }> {
  try {
    const calendar = await scrapeCalendar();
    return { calendar, via: CALENDAR_URL };
  } catch (err) {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token) throw err;
    console.warn(`scrape failed (${err instanceof Error ? err.message : err}); trying GraphQL`);
    const calendar = await graphqlCalendar(token);
    return { calendar, via: "graphql contributionCalendar" };
  }
}

async function main() {
  const { calendar, via } = await loadCalendar();
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(calendar, null, 2)}\n`, "utf8");
  console.log(
    `wrote ${OUT} · ${calendar.total.toLocaleString("en-US")} contributions · ${calendar.days.length} days · ${calendar.from}..${calendar.to} · ${via}`
  );
}

if (import.meta.main) {
  await main();
}
