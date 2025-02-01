import "server-only";
import { getSettings } from "@/lib/server/db/settings";
import { getFeedbackCookie, setFeedbackCookie } from "../utils";
import {
  isFeedbackGivenByTheUser,
  type FeedbackGivenCheckParams,
} from "@/lib/server/db/feedback";
import { getUser } from "@/lib/server/utils";
import { cookies } from "next/headers";
import { getFeedbackKey } from "@/lib/server/feedback-backend/analytics-tag";
import { getCache, ONE_HOUR_TTL } from "@/lib/server/cache/uitls";
import { tasks } from "@trigger.dev/sdk/v3";
import { FeedbackAnalyticsBody } from "@/lib/server/feedback-backend/analytics";
export interface VALIDATION_RESPONSE {
  success: boolean;
  message: string;
  status: number;
  settings?: Record<string, boolean>;
  type?: "auth" | "rate limit";
  userEmail?: string;
  userID?: string;
}

// Validation for check the validation of the user
export async function validateUserForGivingFeedback(
  spaceId: string,
  userIP: string,
  token?: string
): Promise<VALIDATION_RESPONSE> {
  const settings = await getSettings(spaceId);
  const { docs, status } = settings;
  if (!docs || status !== 200)
    return {
      success: false,
      message: "Error fetching the settings",
      status,
      settings: {},
    };
  const {
    authEnabledReview,
    ipEnabledReview,
    nameRequired,
    starRatingRequired,
  } = docs;

  const checks: FeedbackGivenCheckParams["checks"] = { spaceId: spaceId };
  let userEmail = "";
  let userID = "";
  if (authEnabledReview) {
    // making it a universal function for checking authentication with external widget providing token
    const user = await checkAuth(
      token ||
        (cookies().get(process.env.NEXT_SESSION_COOKIE!)?.value as string)
    );
    if (!user)
      return {
        status: 400,
        success: false,
        message: "Authentication Required",
        type: "auth",
      };
    checks["userID"] = user.$id;
    userEmail = user.email;
    userID = user.$id;
  }
  if (ipEnabledReview) checks["ip"] = userIP;

  const given = await isFeedbackGivenByTheUser({ checks });

  if (given) {
    // await setFeedbackCookie()
    return {
      status: 400,
      success: false,
      message: "Already feedback given",
      type: "rate limit",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Successfull",
    settings: {
      ipEnabledReview,
      starRatingRequired,
      authEnabledReview,
      nameRequired,
    },
    userEmail,
    userID,
  };
}

async function checkAuth(token: string) {
  if (!token) return null;
  try {
    return await getUser(token);
  } catch {
    return null;
  }
}

export async function trrigerFeedbackAnalytics(
  userIP: string,
  payload: FeedbackAnalyticsBody
) {
  const key = getFeedbackKey(userIP, payload.space_id);
  try {
    const cache = getCache();
    if (await cache.get(key)) {
      console.info(`${key} already exists`);
      return;
    }
    await tasks.trigger("save-analytics-feedback", payload, {
      tags: ["analytics", "feedback", key],
      // @ts-ignore
      metadata: payload,
    });
    return true;
  } catch (error) {
    console.error({
      message: "Error triggering saving feedback task",
      cacheKey: key,
      error,
    });
    return false;
  }
}
