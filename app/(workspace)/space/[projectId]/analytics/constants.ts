import type { AnalyticsMetric } from "@/lib/analytics/types";

// single-series chart color (blue), used for every analytics mark
export const SERIES_COLOR = "#2a78d6";
export const SERIES_TRACK = "#e8f0fb";

export const METRICS: Record<
  AnalyticsMetric,
  { label: string; chartTitle: string; unit: string; column: string }
> = {
  submit: {
    label: "Feedback received",
    chartTitle: "Feedback submissions per day",
    unit: "submissions",
    column: "Count",
  },
  landing: {
    label: "Landing page visitors",
    chartTitle: "Landing page visitors per day",
    unit: "visitors",
    column: "Visitors",
  },
  wall: {
    label: "Wall of fame visitors",
    chartTitle: "Wall of fame visitors per day",
    unit: "visitors",
    column: "Visitors",
  },
};

export const RANGE_PRESETS = [7, 30, 90] as const;
export const DEFAULT_RANGE = 30;
