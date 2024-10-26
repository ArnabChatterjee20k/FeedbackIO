export const dynamic = "force-dynamic";
import {
  addFeedback,
  FeedbackBody,
  FeedbackGivenCheckParams,
  isFeedbackGivenByTheUser,
} from "@/lib/server/db/feedback";
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
  const userIP = ipAddress(request) || process.env.DEFAULT_IP! || "";
  const spaceId = params.space_id;
  const { docs, status, message } = await getSettings(spaceId);
  if (!docs || status !== 200)
    return NextResponse.json(
      { message: message, success: false },
      { status: status }
    );

  const {
    authEnabledReview,
    ipEnabledReview,
    nameRequired,
    starRatingRequired,
  } = docs;
  const body: FeedbackBody = await request.json();
  const checks: FeedbackGivenCheckParams["checks"] = {};
  if (authEnabledReview) {
    if (!body.userEmail || !body.userID)
      return NextResponse.json(
        {
          message: "Needed user details for authenticated review",
          success: false,
        },
        { status: 400 }
      );
    checks["userID"] = body.userID;
  }

  if (ipEnabledReview) checks["ip"] = userIP;

  const isFeedbackGiven = await isFeedbackGivenByTheUser({ checks });
  if (isFeedbackGiven)
    return NextResponse.json(
      { message: "Already given", success: false },
      { status: 400 }
    );

  if ((starRatingRequired && !body.stars) || (nameRequired && !body.name?.trim()) || !body.feedback.trim())
    return NextResponse.json(
      {
        message: "Please give the feedback and the star rating",
        success: false,
      },
      { status: 400 }
    );

  const { success } = await addFeedback(spaceId, { ...body, userIP: userIP });
  if (!success)
    return NextResponse.json(
      { message: "Some error occured while saving feedback", success: success },
      { status: 500 }
    );

  return NextResponse.json(
    { message: "Feedback saved successfully", success: success },
    { status: 200 }
  );
}