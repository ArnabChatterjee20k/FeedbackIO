// app/analytics.tsx
"use client";

import { Suspense, useState } from "react";
import { SpaceEventAnalytics } from "./space-event-analytics";
import Loader from "./loader";
import { MainChart } from "./components/main-chart";
import { MetadataChart } from "./components/metadata-chart";
import { visitType } from "../types/analytics";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import {
  formatDate,
  getDateFromString,
  getThirtyDaysAgo,
  getToday,
} from "@/lib/date/utils";
import { DateRange } from "react-day-picker";
import { useSearchParams, useRouter } from "next/navigation";
import Sentiment from "./components/sentiment";
import TotalFeedback from "./components/total-feedbacks";

const today = getDateFromString(getToday());
const thirtyDaysAgo = getDateFromString(getThirtyDaysAgo());

export default function Analytics({
  spaceId,
  event,
  visit,
}: {
  spaceId: string;
  event: "submit" | "visit";
  visit?: visitType;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const start = searchParams.get("start")
    ? getDateFromString(searchParams.get("start")!)
    : thirtyDaysAgo;
  const end = searchParams.get("end")
    ? getDateFromString(searchParams.get("end")!)
    : today;

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const params = new URLSearchParams(searchParams);
      params.set("start", formatDate(range.from));
      params.set("end", formatDate(range.to));
      router.replace(`?${params.toString()}`);
    }
  };
  console.log({visit})

  return (
    <Suspense fallback={<Loader />}>
      <section className="flex flex-col max-w-[1400px] w-full mx-auto gap-5">
        <div className="flex flex-col-reverse sm:flex-row px-4 py-2 items-center w-full justify-between gap-3">
          <DateRangePicker
            date={{ from: start, to: end }}
            onDateChange={handleDateChange}
          />
          <div className="flex gap-2 items-center flex-wrap w-full justify-end">
            <Sentiment spaceId={spaceId} />
            <TotalFeedback spaceId={spaceId} />
          </div>
        </div>

        <MainChart spaceId={spaceId} eventType={event} visitType={visit} />
        <div className="flex flex-col sm:flex-row w-full gap-8">
          <SpaceEventAnalytics spaceId={spaceId} event={event} visit={visit} />

          <MetadataChart
            spaceId={spaceId}
            eventType={event}
            visitType={visit}
          />
        </div>
      </section>
    </Suspense>
  );
}
