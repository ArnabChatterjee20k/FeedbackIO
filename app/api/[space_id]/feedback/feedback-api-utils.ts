import "server-only";
import { getSettings } from "@/lib/server/db/settings";
import { getFeedbackCookie } from "../utils";
import {
  isFeedbackGivenByTheUser,
  type FeedbackGivenCheckParams,
} from "@/lib/server/db/feedback";
import { getUser } from "@/lib/server/utils";
interface VALIDATION_RESPONSE {
  success: boolean;
  message: string;
  status: number;
  token?: string;
  settings?: Record<string, boolean>;
}

// Validation for check the validation of the user
export async function validateUserForGivingFeedback(
  spaceId: string,
  userIP: string
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

  if (ipEnabledReview || authEnabledReview) {
    const feedbackToken = await getFeedbackCookie();
    if (feedbackToken)
      return {
        status: 400,
        success: false,
        message: "Already feedback given",
        token: feedbackToken,
      };
  }
  const checks: FeedbackGivenCheckParams["checks"] = {};
  if (authEnabledReview) {
    const user = await checkAuth();
    if (!user)
      return {
        status: 400,
        success: false,
        message: "Authentication Required",
      };
    checks["userID"] = user.$id;
  }
  if (ipEnabledReview) checks["ip"] = userIP;

  const given = await isFeedbackGivenByTheUser({ checks });
  if (given)
    return { status: 400, success: false, message: "Already feedback given" };

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
  };
}


async function checkAuth(){
    try {
        return await getUser()
    } catch {
        return null
    }
}