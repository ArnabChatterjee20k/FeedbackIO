export const dynamic = "force-dynamic";
import { getSettings } from "@/lib/server/db/settings";
import { ipAddress } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { space_id: string } }
) {
  const spaceId = params.space_id;
  const settings = await getSettings(spaceId);
  const { docs, status } = settings;
  if (!docs || status !== 200)
    return NextResponse.json(
      { success: false, settings: {} },
      { status: status }
    );
  const {
    authEnabledReview,
    ipEnabledReview,
    nameRequired,
    starRatingRequired,
  } = docs;
  return NextResponse.json(
    {
      success: true,
      settings: {
        authEnabledReview,
        ipEnabledReview,
        nameRequired,
        starRatingRequired,
      },
    },
    { status: 200 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { space_id: string } }
) {
    const spaceId = params.space_id
    
}
