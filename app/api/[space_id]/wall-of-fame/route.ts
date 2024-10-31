export const revalidate = 2 * 3600;
import {
  getAllWallOfFameFeedbacks,
  getSocialFeedbacks,
} from "@/lib/server/db/feedback";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { space_id: string } }
) {
  const feedbacks = getAllWallOfFameFeedbacks(params.space_id);
  const socialFeedbacks = getSocialFeedbacks({
    type: "all",
    wallOfFame: true,
    spaceId: params.space_id,
  });

  const [feedbacksRes, socialFeedbacksRes] = await Promise.all([
    feedbacks,
    socialFeedbacks,
  ]);

  const combinedFeedbacks = [
    ...(feedbacksRes ? feedbacksRes : []),
    ...(socialFeedbacksRes ? socialFeedbacksRes : []),
  ].sort(
    (a, b) =>
      new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime()
  );

  return NextResponse.json({feedbacks:combinedFeedbacks},{status:200});
}
