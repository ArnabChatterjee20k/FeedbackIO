// components/analytics/TabBasedChart.tsx
"use client";

import { TabBasedChartCard } from "@/components/analytics/TabBasedChartCard";
import { useAnalyticsData } from "../services/useAnalytics";
import ErrorMessage from "../error-message";
import ChartCard from "@/components/analytics/ChartCard";

const defaultData = [
  { category: "countries", data: [] },
  { category: "os", data: [] },
];

export function MetadataChart({
  spaceId,
  eventType,
  visitType,
}: {
  spaceId: string;
  eventType: "submit" | "visit";
  visitType?: string;
}) {
  const { data, isLoading, isError } = useAnalyticsData(
    spaceId,
    eventType,
    visitType
  );

  if (isLoading)
    return <TabBasedChartCard data={defaultData} loading={isLoading} />;
  if (isError)
    <ChartCard title="Metadata">
      <div className="flex w-full justify-center items-center">
        <ErrorMessage />
      </div>
    </ChartCard>;
  return <TabBasedChartCard data={data.metadata} loading={isLoading} />;
}
