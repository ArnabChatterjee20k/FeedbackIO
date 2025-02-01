export const dynamic = "force-dynamic";
import { tasks } from "@trigger.dev/sdk/v3";
import {
  addFeedback,
  FeedbackBody,
  FeedbackGivenCheckParams,
  isFeedbackGivenByTheUser,
} from "@/lib/server/db/feedback";
import { getSettings } from "@/lib/server/db/settings";
import { geolocation, ipAddress } from "@vercel/functions";
import { NextRequest, NextResponse, userAgent } from "next/server";
import {
  trrigerFeedbackAnalytics,
  validateUserForGivingFeedback,
} from "./feedback-api-utils";
import { setFeedbackCookie } from "../utils";
import { getCache } from "@/lib/server/cache/uitls";
import { getFeedbackKey } from "@/lib/server/feedback-backend/analytics-tag";

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
  const userDeviceInfo = userAgent(request);
  const geoInfo = geolocation(request);
  const unknown = "UNKNOWN";
  const { success: feedbackAddSuccess, docId: feedbackId } = await addFeedback(
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
  await trrigerFeedbackAnalytics(userIP, {
    ip_address: userIP,
    browser: userDeviceInfo.browser.name || unknown,
    country: geoInfo.country || unknown,
    feedback: feedback,
    feedback_id: feedbackId || unknown,
    os: userDeviceInfo.os.name || unknown,
    space_id: spaceId,
  });
  return NextResponse.json(
    { message: "Feedback saved successfully", success: feedbackAddSuccess },
    {
      status: 200,
    }
  );
}
