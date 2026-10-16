import { getOverview } from "@/lib/server/analytics";
import { getFeedbackCount } from "@/lib/server/db/feedback";
import { NextRequest, NextResponse } from "next/server";
import { parseAnalyticsRequest } from "../utils";

export async function GET(req: NextRequest) {
  const parsed = await parseAnalyticsRequest(req.nextUrl.searchParams);
  if (parsed.error) return parsed.error;
  const { spaceId, start, end } = parsed;

  try {
    const overview = await getOverview(
      spaceId,
      start,
      end,
      getFeedbackCount(spaceId).catch(() => null)
    );
    return NextResponse.json(overview);
  } catch (error) {
    console.error({ message: "Error fetching analytics overview", error });
    return NextResponse.json({ error: "Could not load analytics" }, { status: 502 });
  }
}
