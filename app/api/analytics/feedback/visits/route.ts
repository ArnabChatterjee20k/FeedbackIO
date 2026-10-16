import { trackVisit } from "@/lib/server/analytics";
import { VISIT_METRIC, type VisitType } from "@/lib/analytics/types";
import { NextRequest, NextResponse } from "next/server";
import { ipAddress, waitUntil } from "@vercel/functions";

// Called from the visitor's browser so the IP / user agent are the visitor's.
export async function POST(req: NextRequest) {
  const { spaceId, pageType, referrer } = await req.json();
  if (!spaceId || !Object.hasOwn(VISIT_METRIC, pageType)) {
    return NextResponse.json({ error: "Bad parameters" }, { status: 400 });
  }
  waitUntil(
    trackVisit(pageType as VisitType, {
      spaceId,
      ip: ipAddress(req) || process.env.DEFAULT_IP || "",
      userAgent: req.headers.get("user-agent") || "",
      referrer: referrer || "",
    })
  );
  return NextResponse.json({ success: true });
}
