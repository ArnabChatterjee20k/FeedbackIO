import { getCache } from "@/lib/server/cache/uitls";
import { VisitAnalyticsBody } from "@/lib/server/feedback-backend/analytics";
import { getVisitKey } from "@/lib/server/feedback-backend/analytics-tag";
import { tasks } from "@trigger.dev/sdk/v3";

export async function trigerLandingPageAnalytics(
  userIP: string,
  payload: VisitAnalyticsBody
) {
  const key = getVisitKey(userIP, payload.space_id, payload.page_type);
  try {
    const cache = getCache();
    if (await cache.get(key)) {
      console.info(`${key} already exists`);
      return;
    }
    await tasks.trigger("save-analytics-visit", payload, {
      tags: ["analytics", "visit", key],
      // @ts-ignore
      metadata: payload,
    });
    return true;
  } catch (error) {
    console.error({
      message: "Error triggering visit analytics task",
      cacheKey: key,
      error,
    });
    return false;
  }
}
