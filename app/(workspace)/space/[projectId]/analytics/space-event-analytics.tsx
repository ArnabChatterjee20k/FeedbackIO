"use client";

import { VerticalBarChartData } from "@/components/analytics/VerticalBarChart";
import ChartCard from "@/components/analytics/ChartCard";
import VerticalBarChart from "@/components/analytics/VerticalBarChart";
import ErrorMessage from "./error-message";
import Loader from "./loader";
import useSWR from "swr";
import { eventType, visitType } from "../types/analytics";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SpaceEventAnalytics({
  spaceId,
  event,
  visit,
}: {
  spaceId: string;
  event: eventType;
  visit?: visitType;
}) {
  const { data, error, isLoading } = useSWR(
    `/api/analytics/feedback/metadata?spaceId=${spaceId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
  if (isLoading)
    return (
      <ChartCard title="Pages">
        <div className="flex w-full justify-center items-center">
          <Loader />
        </div>
      </ChartCard>
    );
  if (error || !data)
    return (
      <ChartCard title="Pages">
        <div className="flex w-full justify-center items-center">
          <ErrorMessage />
        </div>
      </ChartCard>
    );

  const spaceData: VerticalBarChartData[] = [
    {
      name: "feedback-submit",
      value: data.total_feedback,
      fill: "#bbdefb",
      active: event === "submit",
      redirectionLink: "?event=submit",
    },
    {
      name: "/landing-page",
      value: data.landing_page_visit,
      fill: "#c5cae9",
      active: event === "visit" && visit === "landing-page",
      redirectionLink: "?event=visit&visit=landing-page",
    },
    {
      name: "/wall-of-fame",
      value: data.wall_of_fame_visit,
      fill: "#ffcdd2",
      active: event === "visit" && visit === "wall-of-fame",
      redirectionLink: "?event=visit&visit=wall-of-fame",
    },
  ];

  return (
    <ChartCard title="Pages">
      <VerticalBarChart data={spaceData} />
    </ChartCard>
  );
}
