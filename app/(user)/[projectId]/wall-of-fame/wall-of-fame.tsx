export const revalidate = 2 * 3600; // 2 hours
import { Feedbackcard } from "@/app/(workspace)/dashboard/[projectId]/components/feedback-card";
import SocialCard from "@/app/(workspace)/dashboard/[projectId]/components/social-card";
import {
  getAllWallOfFameFeedbacks,
  getSocialFeedbacks,
} from "@/lib/server/db/feedback";

export default async function WallOfFame({
  params,
}: {
  params: { projectId: string };
}) {
  const feedbacks = getAllWallOfFameFeedbacks(params.projectId);
  const socialFeedbacks = getSocialFeedbacks({
    type: "all",
    wallOfFame: true,
    spaceId: params.projectId,
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

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 max-w-[1500px] mx-auto py-5">
        {combinedFeedbacks.map((feedback) => {
          return feedback?.type === "twitter" ||
            feedback?.type === "linkedin" ? (
            <div className="max-w-sm mb-2">
              <SocialCard
                key={feedback.id}
                post={{
                  space_id: params.projectId,
                  type: feedback.type,
                  content: feedback.content,
                  userProfilePicture: feedback.userProfilePicture,
                  url: feedback.url,
                  contentImage: feedback.contentImage,
                  name: feedback.name,
                  tag: feedback.tag,
                  wall_of_fame: feedback.wall_of_fame,
                }}
              />
            </div>
          ) : (
            <div className="max-w-sm mb-2">
              <Feedbackcard
                key={feedback.id}
                email={feedback.userEmail}
                feedback={feedback.feedback}
                stars={feedback.stars}
                name={feedback.name}
                wallOfFame={feedback.wall_of_fame}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
