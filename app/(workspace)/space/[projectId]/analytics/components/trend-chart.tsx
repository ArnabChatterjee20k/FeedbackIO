"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { format } from "date-fns";
import type { AnalyticsMetric } from "@/lib/analytics/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateFromString } from "@/lib/date/utils";
import { METRICS, SERIES_COLOR } from "../constants";
import { fillTimeline, formatNumber } from "../utils";
import { EmptyState } from "./states";

const shortDate = (date: string) => format(getDateFromString(date), "MMM d");

export function TrendChart({
  spaceId,
  metric,
  start,
  end,
  timeline,
  loading,
  empty,
}: {
  spaceId: string;
  metric: AnalyticsMetric;
  start: string;
  end: string;
  timeline?: Record<string, number>;
  loading: boolean;
  empty: boolean;
}) {
  const { chartTitle, unit } = METRICS[metric];
  const data = fillTimeline(timeline, start, end);
  const total = data.reduce((sum, p) => sum + p.value, 0);
  const average = total / data.length;
  const peak = data.reduce((best, p) => (p.value > best.value ? p : best), data[0]);

  return (
    <section className="min-w-0 rounded-xl border bg-card shadow-sm" aria-labelledby="trend-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-[18px] pt-4">
        <h2 id="trend-title" className="text-[15px] font-bold">
          {chartTitle}
        </h2>
        {!loading && !empty && (
          <span className="text-[12.5px] tabular-nums text-muted-foreground">
            {formatNumber(total)} {unit} · {average.toFixed(average < 10 ? 1 : 0)} per day on average
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="m-3 h-[300px]" />
      ) : empty ? (
        <EmptyState spaceId={spaceId} />
      ) : (
        <div className="h-[300px] px-1 pb-2 pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f6" />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                minTickGap={28}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                width={44}
                tickFormatter={formatNumber}
              />
              <Tooltip
                content={<TrendTooltip unit={unit} />}
                cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={SERIES_COLOR}
                strokeWidth={2}
                fill="url(#trend-fill)"
                activeDot={{ r: 5, fill: SERIES_COLOR, stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
              {peak.value > 0 && (
                <ReferenceDot
                  x={peak.date}
                  y={peak.value}
                  r={4}
                  fill={SERIES_COLOR}
                  stroke="#fff"
                  strokeWidth={2}
                  label={{
                    value: `Peak ${formatNumber(peak.value)} · ${shortDate(peak.date)}`,
                    position: "top",
                    offset: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#475569",
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function TrendTooltip({
  active,
  payload,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
  if (!active || !payload?.length) return null;
  const { date, value } = payload[0].payload as { date: string; value: number };
  return (
    <div className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg">
      <div className="text-sm font-bold">{formatNumber(value)}</div>
      {unit} · {format(getDateFromString(date), "EEE, MMM d")}
    </div>
  );
}
