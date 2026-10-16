// app/api/analytics/metadata/route.ts
import { getSpaceEventTotals } from "@/lib/server/analytics";
import { getFeedbackCount } from "@/lib/server/db/feedback";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");
  const start = searchParams.get("start") || undefined;
  const end = searchParams.get("end") || undefined;

  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }

  // total feedback comes from the feedback collection (all time),
  // event totals come from Appwrite Analytics for the selected range
  const [totals, totalFeedback] = await Promise.all([
    getSpaceEventTotals(spaceId, start, end),
    getFeedbackCount(spaceId).catch(() => null),
  ]);
  if (!totals) return NextResponse.json(null, { status: 500 });

  return NextResponse.json({ ...totals, total_feedback: totalFeedback });
}
