import {
  createFeedback,
  FeedbackAnalyticsBody,
} from "@/lib/server/feedback-backend/analytics";
import { logger, task, tasks } from "@trigger.dev/sdk/v3";
import { TEN_MINUTES } from "./config";
import { getCache, ONE_HOUR_TTL } from "@/lib/server/cache/uitls";
import { getFeedbackKey } from "@/lib/server/feedback-backend/analytics-tag";

export const saveFeedbackTask = task({
  id: "save-analytics-feedback",
  maxDuration: TEN_MINUTES,
  run: async (payload: FeedbackAnalyticsBody, { ctx }) => {
    const res = await createFeedback(payload);
    const userIP = payload.ip_address;
    const key = getFeedbackKey(userIP, payload.space_id);

    if (res.status === "error") {
      logger.error(res.error);
      throw new Error(res.error);
    }
    const cache = getCache();
    await cache.set(key, "set", { ex: ONE_HOUR_TTL });
    return;
  },
});
