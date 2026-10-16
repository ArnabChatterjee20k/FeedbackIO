import { getVisitData, trackVisit, VisitType } from "@/lib/server/analytics";
import { NextRequest, NextResponse } from "next/server";
import { ipAddress, waitUntil } from "@vercel/functions";

const VISIT_TYPES: VisitType[] = ["landing page", "wall of fame"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");
  const pageType = searchParams.get("pageType") as VisitType;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!spaceId || !pageType || !start || !end) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const data = await getVisitData(spaceId, pageType, start, end);
  return NextResponse.json(data);
}

// Called from the visitor's browser so the IP / user agent are the visitor's.
export async function POST(req: NextRequest) {
  const { spaceId, pageType, referrer } = await req.json();
  if (!spaceId || !VISIT_TYPES.includes(pageType)) {
    return NextResponse.json({ error: "Bad parameters" }, { status: 400 });
  }
  waitUntil(
    trackVisit(pageType, {
      spaceId,
      ip: ipAddress(req) || process.env.DEFAULT_IP || "",
      userAgent: req.headers.get("user-agent") || "",
      referrer: referrer || "",
    })
  );
  return NextResponse.json({ success: true });
}
