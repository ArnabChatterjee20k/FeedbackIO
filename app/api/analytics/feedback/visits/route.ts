import {
  getVisitData,
  VisitType,
} from "@/lib/server/feedback-backend/analytics";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { trigerLandingPageAnalytics } from "./utils";
import { geolocation, ipAddress } from "@vercel/functions";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");
  const pageType = searchParams.get("pageType") as VisitType;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!spaceId || !pageType || !start || !end) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const data = await getVisitData("feedback", spaceId, pageType, start, end);
  console.log({ visitData: data });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const spaceId = body.spaceId;
  const pageType = body.pageType;
  const userIP = ipAddress(req) || process.env.DEFAULT_IP! || "";
  const userDeviceInfo = userAgent(req);
  const geoInfo = geolocation(req);
  const unknown = "UNKNOWN";
  await trigerLandingPageAnalytics(userIP, {
    ip_address: userIP,
    browser: userDeviceInfo.browser.name || unknown,
    country: geoInfo.country || unknown,
    os: userDeviceInfo.os.name || unknown,
    space_id: spaceId,
    page_type: pageType,
  });
  return NextResponse.json({ success: true });
}