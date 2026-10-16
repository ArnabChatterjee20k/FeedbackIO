export const dynamic = "force-dynamic";
import {
  addFeedback,
  FeedbackBody,
  FeedbackGivenCheckParams,
  isFeedbackGivenByTheUser,
} from "@/lib/server/db/feedback";
import { getSettings } from "@/lib/server/db/settings";
import { ipAddress, waitUntil } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";
import { validateUserForGivingFeedback } from "./feedback-api-utils";
import { setFeedbackCookie } from "../utils";
import { trackFeedbackSubmit } from "@/lib/server/analytics";
import { verifyJWT } from "@/lib/server/tokens/get-token";

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

export async function POST(
  request: NextRequest,
  { params }: { params: { space_id: string } }
) {
  const body: FeedbackBody = await request.json();
  const token = request.nextUrl.searchParams.get("token") || "";
  const apiKey = request.nextUrl.searchParams.get("apiKey") || "";
  if (apiKey) {
    try {
      const payload = await verifyJWT(apiKey);
      if (!payload || payload["space_id"] !== params.space_id)
        return NextResponse.json(
          { success: false, message: "Bad API key" },
          { status: 401 }
        );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Bad API key" },
        { status: 401 }
      );
    }
  }
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
  const { success: feedbackAddSuccess } = await addFeedback(
    spaceId,
    {
      feedback,
      name,
      stars,
      userEmail,
      userID,
      userIP: userIP,
    }
  );
  if (!feedbackAddSuccess)
    return NextResponse.json(
      {
        message: "Some error occured while saving feedback",
        success: feedbackAddSuccess,
      },
      { status: 500 }
    );
  if (!apiKey) {
    waitUntil(
      trackFeedbackSubmit({
        spaceId,
        ip: userIP,
        userAgent: request.headers.get("user-agent") || "",
        referrer: request.headers.get("referer") || "",
      })
    );
  }
  return NextResponse.json(
    { message: "Feedback saved successfully", success: feedbackAddSuccess },
    {
      status: 200,
    }
  );
}
