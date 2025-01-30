"use client";
import React from "react";
import AreaChart, {
  type AreaChartData,
} from "@/components/analytics/AreaChart";

import ChartCard from "@/components/analytics/ChartCard";
import VerticalBarChart,{type VerticalBarChartData} from "@/components/analytics/VerticalBarChart";

const data: AreaChartData[] = [
  { name: "2025-01-28", value: 33 },
  { name: "2025-01-29", value: 25 },
  { name: "2025-01-30", value: 89 },
];

const visitData:VerticalBarChartData[] = [
    {name:"/landing-page",value:200,fill:'#bbdefb'},
    {name:"wall-of-fame",value:40,fill:"#c5cae9"},
    {name:"feedback-submission",value:30,fill:"#ffcdd2"},
]
export default function page() {
  return (
    <section className="flex flex-col max-w-[1400px] w-full mx-auto gap-5">
      <ChartCard>
        <AreaChart data={data} />
      </ChartCard>
      <div className="flex flex-col sm:flex-row w-full gap-8">
        <ChartCard title="PageStatistics">
          <VerticalBarChart data={visitData} />
        </ChartCard>
        <ChartCard title="Metadata">
          <AreaChart data={data} />
        </ChartCard>
      </div>
    </section>
  );
}
