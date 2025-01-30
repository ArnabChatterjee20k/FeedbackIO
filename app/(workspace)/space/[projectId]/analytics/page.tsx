"use client";
import React from "react";
import AreaChart, {
  type AreaChartData,
} from "@/components/analytics/AreaChart";

import ChartCard from "@/components/analytics/ChartCard";
import VerticalBarChart,{type VerticalBarChartData} from "@/components/analytics/VerticalBarChart";
import { TabBasedChartCard } from "@/components/analytics/TabBasedChartCard";

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
const sampleData = [
    {
      category: "Short Links",
      data: [
        { name: "Google", value: 120 },
        { name: "Facebook", value: 80 },
        { name: "Twitter", value: 50 },
      ],
    },
    {
      category: "Destination URLs",
      data: [
        { name: "example.com", value: 200 },
        { name: "mywebsite.io", value: 150 },
        { name: "coolblog.net", value: 100 },
      ],
    },
  ];
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
        <TabBasedChartCard data={sampleData}/>
      </div>
    </section>
  );
}
