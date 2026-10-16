"use client";

import { useState } from "react";
import type {
  AnalyticsBreakdown,
  AnalyticsMetric,
  BreakdownDimension,
  BreakdownRow,
} from "@/lib/analytics/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { METRICS, SERIES_COLOR, SERIES_TRACK } from "../constants";
import { formatNumber } from "../utils";

const TOP = 6;
const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function flag(code: string) {
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1a5 + c.charCodeAt(0))
  );
}

function label(dimension: BreakdownDimension, name: string) {
  if (!name) return dimension === "referrerSource" ? "Direct" : "Unknown";
  if (dimension === "country" && /^[A-Za-z]{2}$/.test(name)) {
    let country = name;
    try {
      country = regionNames?.of(name.toUpperCase()) ?? name;
    } catch {}
    return `${flag(name)} ${country}`;
  }
  return name;
}

// keep the top rows and fold the long tail into "Other"
function topRows(rows: BreakdownRow[]) {
  if (rows.length <= TOP + 1) return rows.map((r) => ({ ...r, other: false }));
  const rest = rows.slice(TOP);
  return [
    ...rows.slice(0, TOP).map((r) => ({ ...r, other: false })),
    {
      name: `Other (${rest.length})`,
      value: rest.reduce((sum, r) => sum + r.value, 0),
      other: true,
    },
  ];
}

export function BreakdownCard({
  title,
  metric,
  tabs,
  data,
  loading,
  error,
  empty,
}: {
  title: string;
  metric: AnalyticsMetric;
  tabs: { label: string; dimension: BreakdownDimension }[];
  data?: AnalyticsBreakdown;
  loading: boolean;
  error: boolean;
  empty: boolean;
}) {
  const [active, setActive] = useState(tabs[0].dimension);
  const activeTab = tabs.find((t) => t.dimension === active) ?? tabs[0];
  const rows = data?.[active] ?? [];
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const shown = topRows(rows);
  const max = Math.max(...shown.map((r) => r.value), 1);

  let body;
  if (loading) {
    body = (
      <div className="flex flex-col gap-2 px-[18px] py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6" style={{ width: `${90 - i * 12}%` }} />
        ))}
      </div>
    );
  } else if (error) {
    body = <Message>This breakdown couldn&apos;t load. Refresh the page to try again.</Message>;
  } else if (empty || rows.length === 0) {
    body = <Message>Breakdowns appear once people start visiting.</Message>;
  } else {
    body = (
      <>
        <div className="grid grid-cols-[minmax(0,1fr)_64px_46px] gap-2.5 px-[18px] pt-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>{activeTab.label}</span>
          <span className="text-right">{METRICS[metric].column}</span>
          <span className="text-right">Share</span>
        </div>
        <ul className="flex flex-col gap-1 px-3.5 pb-3.5 pt-2.5">
          {shown.map((row) => (
            <li
              key={row.name}
              className="grid grid-cols-[minmax(0,1fr)_64px_46px] items-center gap-2.5 rounded-md px-1 tabular-nums hover:bg-muted"
            >
              <div className="relative flex h-[30px] min-w-0 items-center">
                <span
                  className="absolute inset-y-1 left-0 rounded-r"
                  style={{
                    width: `${Math.max(2, (row.value / max) * 100)}%`,
                    background: SERIES_TRACK,
                    borderLeft: `3px solid ${SERIES_COLOR}`,
                  }}
                />
                <span
                  className={cn(
                    "relative truncate pl-2.5 text-[13px] font-semibold",
                    row.other && "font-medium text-muted-foreground"
                  )}
                  title={row.other ? row.name : label(active, row.name)}
                >
                  {row.other ? row.name : label(active, row.name)}
                </span>
              </div>
              <span className="text-right text-[13px] font-bold">{formatNumber(row.value)}</span>
              <span className="text-right text-xs text-muted-foreground">
                {total ? Math.round((row.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <section className="min-w-0 rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-[18px] pt-4">
        <h2 className="text-[15px] font-bold">{title}</h2>
        <span className="text-[12.5px] text-muted-foreground">{METRICS[metric].label}</span>
      </div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b px-3.5 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab.dimension}
            role="tab"
            type="button"
            aria-selected={tab.dimension === active}
            onClick={() => setActive(tab.dimension)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 border-transparent px-2 pb-2.5 pt-2 text-[13px] font-semibold text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tab.dimension === active && "border-foreground text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {body}
    </section>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</p>
  );
}
