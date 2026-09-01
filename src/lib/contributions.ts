/** Public GitHub contribution calendar. Day counts only — no repos, messages, or tokens. */

export type ContributionDay = {
  date: string;
  count: number;
  /** GitHub square intensity 0–4. */
  level: number;
};

export type ContributionCalendar = {
  user: string;
  total: number;
  from: string;
  to: string;
  fetchedAt: string;
  days: ContributionDay[];
};
