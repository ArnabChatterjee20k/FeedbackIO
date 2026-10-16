"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import {
  ANALYTICS_METRICS,
  type AnalyticsMetric,
  type AnalyticsOverview,
} from "@/lib/analytics/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateFromString } from "@/lib/date/utils";
import { cn } from "@/lib/utils";
import { METRICS, SERIES_COLOR } from "../constants";
import { fillTimeline, formatNumber } from "../utils";

const tileClass =
  "flex min-w-0 flex-col gap-1.5 rounded-xl border bg-card px-4 pb-3 pt-3.5 text-left shadow-sm";

export function KpiTiles({
  overview,
  loading,
  empty,
  metric,
  start,
  end,
  onSelect,
}: {
  overview?: AnalyticsOverview;
  loading: boolean;
  empty: boolean;
  metric: AnalyticsMetric;
  start: string;
  end: string;
  onSelect: (metric: AnalyticsMetric) => void;
}) {
  if (loading || !overview)
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={tileClass}>
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-8 w-2/5" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ))}
      </div>
    );

  const days =
    differenceInCalendarDays(getDateFromString(end), getDateFromString(start)) + 1;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Key numbers">
      {ANALYTICS_METRICS.map((key) => {
        const active = key === metric;
        const value = overview.current[key];
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(key)}
            className={cn(
              tileClass,
              "transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active && "border-[#2a78d6] ring-1 ring-[#2a78d6] hover:border-[#2a78d6]"
            )}
          >
            <span className="flex items-center justify-between gap-2 text-[12.5px] font-semibold text-muted-foreground">
              {METRICS[key].label}
              {active && (
                <span className="text-[11px] font-bold text-[#2a78d6]">In chart</span>
              )}
            </span>
            <span className="text-[28px] font-extrabold leading-tight tracking-tight">
              {formatNumber(value)}
            </span>
            <span className="flex min-h-[26px] items-center justify-between gap-2">
              {empty ? (
                <span className="text-xs text-muted-foreground">No data yet</span>
              ) : (
                <>
                  <DeltaChip current={value} previous={overview.previous[key]} days={days} />
                  <Sparkline values={fillTimeline(overview.timelines[key], start, end).map((p) => p.value)} />
                </>
              )}
            </span>
          </button>
        );
      })}
      <div className={tileClass}>
        <span className="text-[12.5px] font-semibold text-muted-foreground">
          All-time feedback
        </span>
        <span className="text-[28px] font-extrabold leading-tight tracking-tight">
          {overview.totalFeedback === null ? "–" : formatNumber(overview.totalFeedback)}
        </span>
        <span className="flex min-h-[26px] items-center text-xs text-muted-foreground">
          Every submission, any channel
        </span>
      </div>
    </div>
  );
}

function DeltaChip({
  current,
  previous,
  days,
}: {
  current: number;
  previous: number;
  days: number;
}) {
  const base = "inline-flex items-center gap-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold";
  if (!previous)
    return (
      <span className={cn(base, "bg-muted text-muted-foreground")}>
        {current ? "New" : "No change"}
      </span>
    );
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0)
    return <span className={cn(base, "bg-muted text-muted-foreground")}>No change</span>;
  const up = pct > 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      title={`${formatNumber(previous)} in the previous ${days} days`}
      className={cn(base, up ? "bg-[#e7f4e7] text-[#006300]" : "bg-[#fbeaea] text-[#b42323]")}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {Math.abs(pct)}%
      <span className="sr-only">{up ? " up" : " down"} vs previous period</span>
    </span>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 84;
  const h = 26;
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - 2 - (v / max) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="hidden h-[26px] w-[84px] flex-none sm:block" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke={SERIES_COLOR}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}
