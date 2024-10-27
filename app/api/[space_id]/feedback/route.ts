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
import { validateUserForGivingFeedback } from "./feedback-api-utils";
import { setFeedbackCookie } from "../utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { space_id: string } }
) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const userIP = ipAddress(request) || process.env.DEFAULT_IP! || "";
  const spaceId = params.space_id;
  const { status, userEmail, userID, ...settingsRes } =
    await validateUserForGivingFeedback(spaceId, userIP, token);
  return NextResponse.json(settingsRes, {
    status: status,
  });
}

// reading the cookies to check
// along with cookies, sending the token in the body as well so that frontend can save it in the frontend to parse the payload and view it
export async function POST(
  request: NextRequest,
  { params }: { params: { space_id: string } }
) {
  const body: FeedbackBody = await request.json();
  const token = request.nextUrl.searchParams.get("token") || ""; // pass it to the session checker
  const userIP = ipAddress(request) || process.env.DEFAULT_IP! || "";
  const spaceId = params.space_id;
  const {
    status,
    message,
    settings,
    success: feedbackGetSuccess,
    type,
    userID,
    userEmail,
  } = await validateUserForGivingFeedback(spaceId, userIP, token);
  if (!settings) {
    return NextResponse.json(
      { success: feedbackGetSuccess, message, type },
      { status: !feedbackGetSuccess ? 400 : status }
    );
  }
  const { starRatingRequired, nameRequired } = settings;
  if (
    (starRatingRequired && !body.stars) ||
    (nameRequired && !body.name?.trim()) ||
    !body.feedback.trim()
  )
    return NextResponse.json(
      {
        message: "Please give the feedback and the star rating",
        success: false,
      },
      { status: 400 }
    );
  const { feedback, name, stars } = body;
  const { success: feedbackAddSuccess } = await addFeedback(spaceId, {
    feedback,
    name,
    stars,
    userEmail,
    userID,
    userIP: userIP,
  });
  if (!feedbackAddSuccess)
    return NextResponse.json(
      {
        message: "Some error occured while saving feedback",
        success: feedbackAddSuccess,
      },
      { status: 500 }
    );

  return NextResponse.json(
    { message: "Feedback saved successfully", success: feedbackAddSuccess },
    {
      status: 200,
    }
  );
}
