// app/api/analytics/metadata/route.ts
import { getSpaceMetadata } from "@/lib/server/feedback-backend/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");

  if (!spaceId) {
    return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
  }

  const data = await getSpaceMetadata("feedback", spaceId);
  return NextResponse.json(data);
}
