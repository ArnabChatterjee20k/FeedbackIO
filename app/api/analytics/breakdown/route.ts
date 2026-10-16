import { ANALYTICS_METRICS, type AnalyticsMetric } from "@/lib/analytics/types";
import { getBreakdown } from "@/lib/server/analytics";
import { NextRequest, NextResponse } from "next/server";
import { parseAnalyticsRequest } from "../utils";

export async function GET(req: NextRequest) {
  const parsed = await parseAnalyticsRequest(req.nextUrl.searchParams);
  if (parsed.error) return parsed.error;
  const { spaceId, start, end } = parsed;

  const metric = req.nextUrl.searchParams.get("metric") as AnalyticsMetric;
  if (!ANALYTICS_METRICS.includes(metric)) {
    return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
  }

  try {
    return NextResponse.json(await getBreakdown(spaceId, metric, start, end));
  } catch (error) {
    console.error({ message: "Error fetching analytics breakdown", error });
    return NextResponse.json({ error: "Could not load analytics" }, { status: 502 });
  }
}
