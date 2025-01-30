import React, { Suspense } from "react";
import AreaChart, {
  type AreaChartData,
} from "@/components/analytics/AreaChart";
import ChartCard from "@/components/analytics/ChartCard";
import { TabBasedChartCard } from "@/components/analytics/TabBasedChartCard";
import { SpaceEventAnalytics } from "./space-event-analytics";
import {
  getFeedbackSubmissionData,
  getVisitData,
} from "@/lib/server/feedback-backend/analytics";
import { eventType, visitType } from "../types/analytics";
import { getPreviousDay, getThirtyDaysAgo, getToday } from "@/lib/date/utils";
import Loader from "./loader";

interface Data {
  category: string;
  data: { name: string; value: number }[];
}

interface TabBasedChartCardProps {
  data: Data[];
}

export default async function Analytics({
  spaceId,
  event,
  visit,
}: {
  spaceId: string;
  event: eventType;
  visit?: visitType;
}) {
  const start = getThirtyDaysAgo();
  const end = getToday();

  let data: AreaChartData[] = [];
  let metadata: Record<string, Record<string, number>> = {};

  if (event === "submit") {
    const response = await getFeedbackSubmissionData(
      "feedback",
      spaceId,
      start,
      end
    );
    if (!response?.feedbacks) return null;

    data = Object.entries(response.feedbacks).map(([name, value]) => ({
      name,
      value,
    }));

    if (data.length === 1) {
      data = [{ name: getPreviousDay(data[0].name), value: 0 }, ...data];
    }

    metadata = response.metadata;
  } else {
    const pageType = visit === "landing-page" ? "landing page" : "wall of fame";
    const response = await getVisitData(
      "feedback",
      spaceId,
      pageType,
      start,
      end
    );
    if (!response?.visits) return null;

    data = Object.entries(response.visits).map(([name, value]) => ({
      name,
      value,
    }));

    if (data.length === 1)
      data = [{ name: getPreviousDay(data[0].name), value: 0 }, ...data];

    metadata = response.metadata;
  }

  // Transform metadata for TabBasedChartCard
  const tabBasedData: TabBasedChartCardProps["data"] = Object.entries(
    metadata
  ).map(([category, values]) => ({
    category,
    data: Object.entries(values).map(([name, value]) => ({
      name,
      value,
    })),
  }));

  return (
    <Suspense fallback={<Loader />}>
      <section className="flex flex-col max-w-[1400px] w-full mx-auto gap-5">
        <ChartCard>
          <AreaChart data={data} />
        </ChartCard>
        <div className="flex flex-col sm:flex-row w-full gap-8">
          <SpaceEventAnalytics spaceId={spaceId} event={event} visit={visit} />
          <TabBasedChartCard data={tabBasedData} />
        </div>
      </section>
    </Suspense>
  );
}
