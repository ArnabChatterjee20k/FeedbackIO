"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { subDays } from "date-fns";
import { ANALYTICS_METRICS, type AnalyticsMetric } from "@/lib/analytics/types";
import { formatDate, getDateFromString } from "@/lib/date/utils";
import { DEFAULT_RANGE } from "./constants";
import { useBreakdown, useOverview } from "./services/useAnalytics";
import { RangeControls } from "./components/range-controls";
import { KpiTiles } from "./components/kpi-tiles";
import { TrendChart } from "./components/trend-chart";
import { BreakdownCard } from "./components/breakdown-card";
import { ErrorState } from "./components/states";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function useAnalyticsParams() {
  const searchParams = useSearchParams();
  const today = formatDate(new Date());
  const start = searchParams.get("start") ?? "";
  const end = searchParams.get("end") ?? "";
  const metric = searchParams.get("metric") as AnalyticsMetric;
  const validRange = DATE.test(start) && DATE.test(end) && start <= end;
  return {
    searchParams,
    start: validRange
      ? start
      : formatDate(subDays(getDateFromString(today), DEFAULT_RANGE - 1)),
    end: validRange ? end : today,
    metric: ANALYTICS_METRICS.includes(metric) ? metric : "landing",
  };
}

export default function Analytics({
  spaceId,
  spaceName,
}: {
  spaceId: string;
  spaceName?: string;
}) {
  const router = useRouter();
  const { searchParams, start, end, metric } = useAnalyticsParams();

  const overview = useOverview(spaceId, start, end);
  const breakdown = useBreakdown(spaceId, metric, start, end);

  const update = (values: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(values).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params}`, { scroll: false });
  };

  const isEmpty =
    !!overview.data &&
    ANALYTICS_METRICS.every((m) => overview.data!.current[m] === 0);

  return (
    <section className="flex flex-col max-w-[1240px] w-full mx-auto gap-5 p-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visits and feedback for{" "}
            {spaceName ? (
              <span className="font-semibold text-foreground">{spaceName}</span>
            ) : (
              "this space"
            )}
          </p>
        </div>
        <RangeControls
          start={start}
          end={end}
          onChange={(range) => update(range)}
        />
      </header>

      {overview.error && !overview.data ? (
        <ErrorState onRetry={() => overview.mutate()} />
      ) : (
        <>
          <KpiTiles
            overview={overview.data}
            loading={!overview.data}
            empty={isEmpty}
            metric={metric}
            start={start}
            end={end}
            onSelect={(m) => update({ metric: m })}
          />

          <TrendChart
            spaceId={spaceId}
            metric={metric}
            start={start}
            end={end}
            timeline={overview.data?.timelines[metric]}
            loading={!overview.data}
            empty={isEmpty}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <BreakdownCard
              title="Where visitors come from"
              metric={metric}
              tabs={[
                { label: "Countries", dimension: "country" },
                { label: "Referrers", dimension: "referrerSource" },
              ]}
              data={breakdown.data}
              loading={!breakdown.data && !breakdown.error}
              error={!!breakdown.error && !breakdown.data}
              empty={isEmpty}
            />
            <BreakdownCard
              title="What they use"
              metric={metric}
              tabs={[
                { label: "Browsers", dimension: "browser" },
                { label: "Operating systems", dimension: "operatingSystem" },
                { label: "Devices", dimension: "device" },
              ]}
              data={breakdown.data}
              loading={!breakdown.data && !breakdown.error}
              error={!!breakdown.error && !breakdown.data}
              empty={isEmpty}
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Changes compare against the previous period of the same length.
            Visitors are counted once per day. Dates are in UTC.
          </p>
        </>
      )}
    </section>
  );
}
