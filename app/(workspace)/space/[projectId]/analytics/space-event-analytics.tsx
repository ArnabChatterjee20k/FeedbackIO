import { VerticalBarChartData } from "@/components/analytics/VerticalBarChart";
import ChartCard from "@/components/analytics/ChartCard";
import VerticalBarChart from "@/components/analytics/VerticalBarChart";
import ErrorMessage from "./error-message";
import Loader from "./loader";
import { useSearchParams } from "next/navigation";
import { eventType, visitType } from "../types/analytics";
import { useSpaceEventAnalytics } from "./services/useSpaceEventAnalytics";

export function SpaceEventAnalytics({
  spaceId,
  event,
  visit,
}: {
  spaceId: string;
  event: eventType;
  visit?: visitType;
}) {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const buildRedirectionLink = (base: string) => {
    const params = new URLSearchParams();
    const newBase = encodeURI(base);
    console.log({ newBase });
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    return params.toString() ? `${newBase}&${params.toString()}` : newBase;
  };

  const { data, error, isLoading } = useSpaceEventAnalytics(spaceId);

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
      redirectionLink: buildRedirectionLink("?event=submit"),
    },
    {
      name: "/landing-page",
      value: data.landing_page_visit,
      fill: "#c5cae9",
      active:
        event === "visit" && decodeURI(visit as string) === "landing page",
      redirectionLink: buildRedirectionLink(`?event=visit&visit=landing page`),
    },
    {
      name: "/wall-of-fame",
      value: data.wall_of_fame_visit,
      fill: "#ffcdd2",
      active:
        event === "visit" && decodeURI(visit as string) === "wall of fame",
      redirectionLink: buildRedirectionLink(`?event=visit&visit=wall of fame`),
    },
  ];

  return (
    <ChartCard title="Total Stats">
      <VerticalBarChart data={spaceData} />
    </ChartCard>
  );
}
