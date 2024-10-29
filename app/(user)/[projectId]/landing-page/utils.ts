import "server-only";
import { FeedbackFormProps } from "@/components/landing-page";
import { validateUserForGivingFeedback } from "@/app/api/[space_id]/feedback/feedback-api-utils";
import { ipAddress } from "@vercel/functions";
import { type VALIDATION_RESPONSE } from "@/app/api/[space_id]/feedback/feedback-api-utils";
import { headers } from "next/headers";

interface UserSettingsResponse {
  success: boolean;
  message: string;
  settings?: FeedbackFormProps;
  type?: "auth" | "rate limit";
}

export async function getUserSettingsStatus(spaceId: string):Promise<VALIDATION_RESPONSE> {
  const userIP = headers().get("x-real-ip") || process.env.DEFAULT_IP!;
  console.log({ "user ip coming": userIP });
  const data = await validateUserForGivingFeedback(spaceId, userIP);
  console.log()
  return data
}
