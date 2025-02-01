import { VisitType } from "@/lib/server/feedback-backend/analytics";
import axios from "axios";

export async function postVisitAnalytics(spaceId: string, pageType: VisitType) {
  try {
    const host = process.env.NEXT_PUBLIC_APP_URL!;
    await axios.post(`${host}/api/analytics/feedback/visits`, {
      spaceId,
      pageType: pageType,
    });
  } catch (error) {
    console.error({
      message: "Error occurred in landing page posting analytics",
      error,
    });
  }
}
