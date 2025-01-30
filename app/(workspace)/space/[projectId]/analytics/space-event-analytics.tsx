import ChartCard from "@/components/analytics/ChartCard";
import VerticalBarChart, {
  type VerticalBarChartData,
} from "@/components/analytics/VerticalBarChart";
import ErrorMessage from "./error-message";
import Loader from "./loader";
import { getSpaceMetadata } from "@/lib/server/feedback-backend/analytics";
import { Suspense } from "react";
import { eventType, visitType } from "../types/analytics";

export async function SpaceEventAnalytics({
  spaceId,
  event,
  visit,
}: {
  spaceId: string;
  event: eventType;
  visit?: visitType;
}) {
  const data = await getSpaceMetadata("feedback", spaceId);
  if (!data) return <ErrorMessage />;
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
    <Suspense fallback={<Loader />}>
      <ChartCard title="Pages">
        <VerticalBarChart data={spaceData} />
      </ChartCard>
    </Suspense>
  );
}
