// Shared between the analytics API routes and the dashboard.

export type AnalyticsMetric = "submit" | "landing" | "wall";

export const ANALYTICS_METRICS: AnalyticsMetric[] = ["submit", "landing", "wall"];

export type VisitType = "landing page" | "wall of fame";

export const VISIT_METRIC: Record<VisitType, AnalyticsMetric> = {
  "landing page": "landing",
  "wall of fame": "wall",
};

export type MetricTotals = Record<AnalyticsMetric, number>;

export interface AnalyticsOverview {
  // all-time count from the feedback collection
  totalFeedback: number | null;
  current: MetricTotals;
  // same-length window right before the selected range
  previous: MetricTotals;
  // yyyy-MM-dd -> count, only days with activity
  timelines: Record<AnalyticsMetric, Record<string, number>>;
}

export type BreakdownDimension =
  | "country"
  | "referrerSource"
  | "browser"
  | "operatingSystem"
  | "device";

export const BREAKDOWN_DIMENSIONS: BreakdownDimension[] = [
  "country",
  "referrerSource",
  "browser",
  "operatingSystem",
  "device",
];

export type BreakdownRow = { name: string; value: number };

export type AnalyticsBreakdown = Record<BreakdownDimension, BreakdownRow[]>;
