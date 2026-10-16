"use client";

import { differenceInCalendarDays, subDays } from "date-fns";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { formatDate, getDateFromString } from "@/lib/date/utils";
import { cn } from "@/lib/utils";
import { RANGE_PRESETS } from "../constants";

export function RangeControls({
  start,
  end,
  onChange,
}: {
  start: string;
  end: string;
  onChange: (range: { start: string; end: string }) => void;
}) {
  const today = formatDate(new Date());
  const from = getDateFromString(start);
  const to = getDateFromString(end);
  const span = differenceInCalendarDays(to, from) + 1;
  const activePreset = end === today ? span : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Date range"
        className="inline-flex gap-0.5 rounded-lg border bg-muted p-[3px]"
      >
        {RANGE_PRESETS.map((days) => (
          <button
            key={days}
            type="button"
            aria-pressed={activePreset === days}
            onClick={() =>
              onChange({
                start: formatDate(subDays(getDateFromString(today), days - 1)),
                end: today,
              })
            }
            className={cn(
              "rounded-md px-3 py-1.5 text-[13px] font-semibold text-muted-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activePreset === days && "bg-background text-foreground shadow-sm"
            )}
          >
            {days}D
          </button>
        ))}
      </div>
      <DateRangePicker
        date={{ from, to }}
        onDateChange={(range) => {
          if (range?.from && range?.to)
            onChange({ start: formatDate(range.from), end: formatDate(range.to) });
        }}
      />
    </div>
  );
}
