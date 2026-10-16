import { eachDayOfInterval } from "date-fns";
import { formatDate, getDateFromString } from "@/lib/date/utils";

// One point per day in the range, with 0 for days that had no activity,
// so the chart never interpolates across gaps.
export function fillTimeline(
  timeline: Record<string, number> | undefined,
  start: string,
  end: string
) {
  return eachDayOfInterval({
    start: getDateFromString(start),
    end: getDateFromString(end),
  }).map((day) => {
    const date = formatDate(day);
    return { date, value: timeline?.[date] ?? 0 };
  });
}

export const formatNumber = (n: number) => n.toLocaleString("en-US");
