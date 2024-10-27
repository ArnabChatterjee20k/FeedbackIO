import "server-only";
import { getSettings } from "@/lib/server/db/settings";
import { getFeedbackCookie, setFeedbackCookie } from "../utils";
import {
  isFeedbackGivenByTheUser,
  type FeedbackGivenCheckParams,
} from "@/lib/server/db/feedback";
import { getUser } from "@/lib/server/utils";
interface VALIDATION_RESPONSE {
  success: boolean;
  message: string;
  status: number;
  settings?: Record<string, boolean>;
  type?: string;
  userEmail?:string,
  userID?:string
}

// Validation for check the validation of the user
export async function validateUserForGivingFeedback(
  spaceId: string,
  userIP: string,
  token?:string
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
        type:"rate limit",
      };
  }
  const checks: FeedbackGivenCheckParams["checks"] = {};
  let userEmail = ""
  let userID = ""
  if (authEnabledReview) {
    const user = await checkAuth(token as string);
    if (!user)
      return {
        status: 400,
        success: false,
        message: "Authentication Required",
        type: "auth",
      };
    checks["userID"] = user.$id;
    userEmail = user.email
    userID = user.$id
  }
  if (ipEnabledReview) checks["ip"] = userIP;

  const given = await isFeedbackGivenByTheUser({ checks });
  if (given){
    await setFeedbackCookie()
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
    userID
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
