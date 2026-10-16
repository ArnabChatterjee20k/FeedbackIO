import "server-only";
import { Query } from "node-appwrite";

// Appwrite Analytics REST client.
// node-appwrite@14 has no Analytics service, so we talk to the REST API directly.
// The API key needs the `analytics.read` and `analytics.write` scopes.
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const API_KEY =
  process.env.APPWRITE_ANALYTICS_KEY || process.env.NEXT_APPWRITE_KEY!;
const PROPERTY_ID = process.env.APPWRITE_ANALYTICS_PROPERTY_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://feedbackio.app";

const ONE_HOUR = 3600;

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": PROJECT_ID,
  "X-Appwrite-Key": API_KEY,
};

export type VisitType = "landing page" | "wall of fame";

// Event names are namespaced by space id so a single analytics property can
// serve every space: metrics are filtered with `eventName` queries.
const EVENTS = {
  submit: "feedback_submit",
  "landing page": "landing_page_visit",
  "wall of fame": "wall_of_fame_visit",
} as const;

type EventKey = keyof typeof EVENTS;

const PAGE_PATHS: Record<EventKey, string> = {
  submit: "feedback",
  "landing page": "landing-page",
  "wall of fame": "wall-of-fame",
};

function eventName(spaceId: string, event: EventKey) {
  return `${spaceId}:${EVENTS[event]}`;
}

// Visits count unique visitors (matches the old per-IP dedupe),
// submissions count every event.
function metricFor(event: EventKey) {
  return event === "submit" ? "events" : "visitors";
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
  event: EventKey,
  { spaceId, ip, userAgent, referrer }: TrackBody
): Promise<AnalyticsCreationResult> {
  const url = new URL(`/${spaceId}/${PAGE_PATHS[event]}`, APP_URL);
  try {
    const res = await fetch(
      `${ENDPOINT}/analytics/properties/${PROPERTY_ID}/events`,
      {
        method: "POST",
        headers,
        cache: "no-store",
        body: JSON.stringify({
          name: eventName(spaceId, event),
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
  return createEvent(visitType, body);
}

// ---------- Metrics ----------

type Dimension = "country" | "browser" | "operatingSystem" | "eventName";

interface AnalyticsMetric {
  value: string | null;
  date: string | null;
  visitors: number;
  events: number;
}

interface AnalyticsMetricList {
  total: number;
  metrics: AnalyticsMetric[];
}

interface MetricsParams {
  queries: string[];
  interval?: "1d";
  dimensions?: Dimension[];
  start?: string;
  end?: string;
}

// start/end come in as yyyy-MM-dd and cover whole days (UTC)
function toRange(start?: string, end?: string) {
  return {
    ...(start ? { startAt: `${start}T00:00:00.000Z` } : {}),
    ...(end ? { endAt: `${end}T23:59:59.999Z` } : {}),
  };
}

async function listMetrics({
  queries,
  interval,
  dimensions = [],
  start,
  end,
}: MetricsParams): Promise<AnalyticsMetric[]> {
  const params = new URLSearchParams();
  queries.forEach((q) => params.append("queries[]", q));
  dimensions.forEach((d) => params.append("dimensions[]", d));
  if (interval) params.set("interval", interval);
  Object.entries(toRange(start, end)).forEach(([k, v]) => params.set(k, v));

  const res = await fetch(
    `${ENDPOINT}/analytics/properties/${PROPERTY_ID}/metrics?${params}`,
    { headers, next: { revalidate: ONE_HOUR } }
  );
  if (!res.ok) throw new Error(await res.text());
  const data: AnalyticsMetricList = await res.json();
  return data.metrics;
}

function toRecord(
  rows: AnalyticsMetric[],
  key: (row: AnalyticsMetric) => string,
  metric: "visitors" | "events"
) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[key(row)] = (acc[key(row)] || 0) + (row[metric] || 0);
    return acc;
  }, {});
}

type SpaceEventTotals = {
  feedback_submit: number;
  landing_page_visit: number;
  wall_of_fame_visit: number;
};

export async function getSpaceEventTotals(
  spaceId: string,
  start?: string,
  end?: string
): Promise<SpaceEventTotals | null> {
  try {
    const rows = await listMetrics({
      queries: [Query.startsWith("eventName", `${spaceId}:`)],
      dimensions: ["eventName"],
      start,
      end,
    });
    const find = (event: EventKey) => {
      const row = rows.find((r) => r.value === eventName(spaceId, event));
      return row ? row[metricFor(event)] || 0 : 0;
    };
    return {
      feedback_submit: find("submit"),
      landing_page_visit: find("landing page"),
      wall_of_fame_visit: find("wall of fame"),
    };
  } catch (error) {
    console.error({ message: "Error fetching space metadata", error });
    return null;
  }
}

type AnalyticsRecord = {
  success: boolean;
  metadata: {
    countries: Record<string, number>;
    browsers: Record<string, number>;
    os: Record<string, number>;
  };
};

const UNKNOWN = "UNKNOWN";

async function getEventData(
  spaceId: string,
  event: EventKey,
  start?: string,
  end?: string
) {
  const queries = [Query.equal("eventName", eventName(spaceId, event))];
  const metric = metricFor(event);
  const breakdown = (dimension: Dimension) =>
    listMetrics({ queries, dimensions: [dimension], start, end }).then(
      (rows) => toRecord(rows, (r) => r.value || UNKNOWN, metric)
    );

  const [series, countries, browsers, os] = await Promise.all([
    listMetrics({ queries, interval: "1d", start, end }),
    breakdown("country"),
    breakdown("browser"),
    breakdown("operatingSystem"),
  ]);

  const timeline = toRecord(
    series.filter((r) => r[metric] > 0),
    (r) => (r.date || "").slice(0, 10),
    metric
  );

  return { timeline, metadata: { countries, browsers, os } };
}

type VisitTypeResponse = AnalyticsRecord & {
  visits: Record<string, number>;
};

export async function getVisitData(
  spaceId: string,
  visitType: VisitType,
  start?: string,
  end?: string
): Promise<VisitTypeResponse | null> {
  if (!(visitType in EVENTS)) return null;
  try {
    const { timeline, metadata } = await getEventData(
      spaceId,
      visitType,
      start,
      end
    );
    return { success: true, visits: timeline, metadata };
  } catch (error) {
    console.error({ message: "Error fetching visit analytics", error });
    return null;
  }
}

type FeedbackSubmissionResponse = AnalyticsRecord & {
  feedbacks: Record<string, number>;
};

export async function getFeedbackSubmissionData(
  spaceId: string,
  start?: string,
  end?: string
): Promise<FeedbackSubmissionResponse | null> {
  try {
    const { timeline, metadata } = await getEventData(
      spaceId,
      "submit",
      start,
      end
    );
    return { success: true, feedbacks: timeline, metadata };
  } catch (error) {
    console.error({ message: "Error fetching feedback analytics", error });
    return null;
  }
}
