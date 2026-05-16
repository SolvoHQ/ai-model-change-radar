import rawEvents from '../../data/events.json';

export interface RadarEvent {
  id: string;
  provider: string;
  title: string;
  models: string[];
  surface: string;
  event_type: string;
  announced_date: string;
  effective_date: string;
  effective_note: string;
  notice_days: number | null;
  replacement: string;
  impact: string;
  source_url: string;
}

export interface RadarMeta {
  title: string;
  tagline: string;
  providers: string[];
  last_reviewed: string;
  review_note: string;
  site_url: string;
}

export interface RadarData {
  meta: RadarMeta;
  events: RadarEvent[];
}

const data = rawEvents as RadarData;

export const meta = data.meta;

// Sort by effective_date ascending: most imminent shutdowns first.
export const events: RadarEvent[] = [...data.events].sort((a, b) =>
  a.effective_date.localeCompare(b.effective_date)
);

export type EventStatus = {
  label: string;
  kind: 'past' | 'imminent' | 'soon' | 'future';
  days: number;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Compute a status badge at BUILD time by comparing effective_date to the
 * actual system date. Uses UTC midnight on both sides so the day count is
 * stable regardless of build-machine timezone.
 */
export function computeStatus(effectiveDate: string, now: Date = new Date()): EventStatus {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const [y, m, d] = effectiveDate.split('-').map(Number);
  const eff = Date.UTC(y, m - 1, d);
  const days = Math.round((eff - today) / MS_PER_DAY);

  if (days <= 0) {
    return { label: 'ALREADY IN EFFECT', kind: 'past', days };
  }
  if (days <= 14) {
    return { label: `IN ${days} DAY${days === 1 ? '' : 'S'}`, kind: 'imminent', days };
  }
  if (days <= 45) {
    return { label: `IN ${days} DAYS`, kind: 'soon', days };
  }
  return { label: `IN ${days} DAYS`, kind: 'future', days };
}

export const BUILD_DATE: string = (() => {
  const n = new Date();
  const mm = String(n.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(n.getUTCDate()).padStart(2, '0');
  return `${n.getUTCFullYear()}-${mm}-${dd}`;
})();

export function fmtDate(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

export const PROVIDERS: string[] = Array.from(
  new Set(events.map((e) => e.provider))
).sort();
