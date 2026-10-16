import "server-only";
import { Query } from "node-appwrite";
import {
  ANALYTICS_METRICS,
  BREAKDOWN_DIMENSIONS,
  VISIT_METRIC,
  type AnalyticsBreakdown,
  type AnalyticsMetric,
  type AnalyticsOverview,
  type BreakdownDimension,
  type MetricTotals,
  type VisitType,
} from "@/lib/analytics/types";

// Appwrite Analytics REST client.
// node-appwrite@14 has no Analytics service, so we talk to the REST API directly.
// The API key needs the `analytics.read` and `analytics.write` scopes.
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const API_KEY =
  process.env.APPWRITE_ANALYTICS_KEY || process.env.NEXT_APPWRITE_KEY!;
const PROPERTY_ID = process.env.APPWRITE_ANALYTICS_PROPERTY_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://feedbackio.app";

const FIVE_MINUTES = 300;
const DAY = 24 * 60 * 60 * 1000;

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": PROJECT_ID,
  "X-Appwrite-Key": API_KEY,
};

export type { VisitType };

// Event names are namespaced by space id so a single analytics property can
// serve every space: metrics are filtered with `eventName` queries.
const EVENTS: Record<AnalyticsMetric, string> = {
  submit: "feedback_submit",
  landing: "landing_page_visit",
  wall: "wall_of_fame_visit",
};

const PAGE_PATHS: Record<AnalyticsMetric, string> = {
  submit: "feedback",
  landing: "landing-page",
  wall: "wall-of-fame",
};

function eventName(spaceId: string, metric: AnalyticsMetric) {
  return `${spaceId}:${EVENTS[metric]}`;
}

// Visits count unique visitors, submissions count every event.
function countFor(metric: AnalyticsMetric) {
  return metric === "submit" ? "events" : "visitors";
}

// ---------- Tracking ----------

export interface TrackBody {
  spaceId: string;
  ip: string;
  userAgent: string;
  referrer?: string;
}

type AnalyticsCreationResult =
  | { status: "success" }
  | { status: "error"; error: string };

async function createEvent(
  metric: AnalyticsMetric,
  { spaceId, ip, userAgent, referrer }: TrackBody
): Promise<AnalyticsCreationResult> {
  const url = new URL(`/${spaceId}/${PAGE_PATHS[metric]}`, APP_URL);
  try {
    const res = await fetch(
      `${ENDPOINT}/analytics/properties/${PROPERTY_ID}/events`,
      {
        method: "POST",
        headers,
        cache: "no-store",
        body: JSON.stringify({
          name: eventName(spaceId, metric),
          url: url.toString(),
          domain: url.hostname,
          referrer: referrer || "",
          props: ["spaceId", spaceId],
          ip,
          userAgent,
        }),
      }
    );
    if (!res.ok) {
      const error = await res.text();
      console.error({ message: "Appwrite analytics event failed", error });
      return { status: "error", error };
    }
    return { status: "success" };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error({ message: "Appwrite analytics event failed", error });
    return { status: "error", error };
  }
}

export function trackFeedbackSubmit(body: TrackBody) {
  return createEvent("submit", body);
}

export function trackVisit(visitType: VisitType, body: TrackBody) {
  return createEvent(VISIT_METRIC[visitType], body);
}

// ---------- Metrics ----------

interface MetricRow {
  value: string | null;
  date: string | null;
  visitors: number;
  events: number;
}

interface MetricsParams {
  queries: string[];
  interval?: "1d";
  dimensions?: (BreakdownDimension | "eventName")[];
  start: string;
  end: string;
  limit?: number;
}

// start/end are yyyy-MM-dd and cover whole days (UTC)
async function listMetrics({
  queries,
  interval,
  dimensions = [],
  start,
  end,
  limit,
}: MetricsParams): Promise<MetricRow[]> {
  const params = new URLSearchParams({
    startAt: `${start}T00:00:00.000Z`,
    endAt: `${end}T23:59:59.999Z`,
  });
  queries.forEach((q) => params.append("queries[]", q));
  dimensions.forEach((d) => params.append("dimensions[]", d));
  if (interval) params.set("interval", interval);
  if (limit) params.set("limit", String(limit));

  const res = await fetch(
    `${ENDPOINT}/analytics/properties/${PROPERTY_ID}/metrics?${params}`,
    { headers, next: { revalidate: FIVE_MINUTES } }
  );
  if (!res.ok) throw new Error(await res.text());
  const data: { metrics: MetricRow[] } = await res.json();
  return data.metrics;
}

const toISODate = (time: number) => new Date(time).toISOString().slice(0, 10);

// the window of the same length that ends the day before `start`
function previousWindow(start: string, end: string) {
  const s = Date.parse(start);
  const length = Date.parse(end) - s + DAY;
  return { start: toISODate(s - length), end: toISODate(s - DAY) };
}

async function getTotals(
  spaceId: string,
  start: string,
  end: string
): Promise<MetricTotals> {
  const rows = await listMetrics({
    queries: [Query.startsWith("eventName", `${spaceId}:`)],
    dimensions: ["eventName"],
    start,
    end,
  });
  const totals = {} as MetricTotals;
  for (const metric of ANALYTICS_METRICS) {
    const row = rows.find((r) => r.value === eventName(spaceId, metric));
    totals[metric] = row ? row[countFor(metric)] || 0 : 0;
  }
  return totals;
}

async function getTimeline(
  spaceId: string,
  metric: AnalyticsMetric,
  start: string,
  end: string
) {
  const rows = await listMetrics({
    queries: [Query.equal("eventName", eventName(spaceId, metric))],
    interval: "1d",
    start,
    end,
  });
  const count = countFor(metric);
  const timeline: Record<string, number> = {};
  for (const row of rows) {
    if (!row.date || !row[count]) continue;
    const day = row.date.slice(0, 10);
    timeline[day] = (timeline[day] || 0) + row[count];
  }
  return timeline;
}

export async function getOverview(
  spaceId: string,
  start: string,
  end: string,
  totalFeedback: Promise<number | null>
): Promise<AnalyticsOverview> {
  const prev = previousWindow(start, end);
  const [current, previous, submit, landing, wall, total] = await Promise.all([
    getTotals(spaceId, start, end),
    getTotals(spaceId, prev.start, prev.end),
    getTimeline(spaceId, "submit", start, end),
    getTimeline(spaceId, "landing", start, end),
    getTimeline(spaceId, "wall", start, end),
    totalFeedback,
  ]);
  return {
    totalFeedback: total,
    current,
    previous,
    timelines: { submit, landing, wall },
  };
}

export async function getBreakdown(
  spaceId: string,
  metric: AnalyticsMetric,
  start: string,
  end: string
): Promise<AnalyticsBreakdown> {
  const queries = [Query.equal("eventName", eventName(spaceId, metric))];
  const count = countFor(metric);
  const results = await Promise.all(
    BREAKDOWN_DIMENSIONS.map((dimension) =>
      listMetrics({ queries, dimensions: [dimension], start, end, limit: 50 })
    )
  );
  const breakdown = {} as AnalyticsBreakdown;
  BREAKDOWN_DIMENSIONS.forEach((dimension, i) => {
    breakdown[dimension] = results[i]
      .map((row) => ({ name: row.value || "", value: row[count] || 0 }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value);
  });
  return breakdown;
}
