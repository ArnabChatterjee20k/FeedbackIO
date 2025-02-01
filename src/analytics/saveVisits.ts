import {
  createVisit,
  VisitAnalyticsBody,
} from "@/lib/server/feedback-backend/analytics";
import { logger, task, tasks } from "@trigger.dev/sdk/v3";
import { TEN_MINUTES } from "./config";
import { getCache, ONE_HOUR_TTL } from "@/lib/server/cache/uitls";
import { getVisitKey } from "@/lib/server/feedback-backend/analytics-tag";

export const saveVisitTask = task({
  id: "save-analytics-visit",
  maxDuration: TEN_MINUTES,
  run: async (payload: VisitAnalyticsBody, { ctx }) => {
    const res = await createVisit(payload);
    const userIP = payload.ip_address;
    const key = getVisitKey(userIP, payload.space_id, payload.page_type);

    if (res.status === "error") {
      logger.error(res.error);
      throw new Error(res.error);
    }
    const cache = getCache();
    await cache.set(key, "set", { ex: ONE_HOUR_TTL });
    return;
  },
});
