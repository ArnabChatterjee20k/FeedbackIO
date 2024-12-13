import React from "react";
import { getAllFeedbacks, getSocialFeedbacks } from "@/lib/server/db/feedback";
import { Feedbackcard } from "@/app/(workspace)/space/[projectId]/components/feedback-card";
import PaginatedView from "@/app/(workspace)/space/[projectId]/feedbacks/component/paginated-view";
import SocialCard from "@/app/(workspace)/space/[projectId]/components/social-card";

export default async function page({
  params,
}: {
  params: { pageId: string; projectId: string };
}) {
  try {
    const feedbacks = getAllFeedbacks({
      space_id: params.projectId,
      page: parseInt(params.pageId) || 1,
    });
    const socialFeedbacks =
      params.pageId === "1" || !params.pageId
        ? getSocialFeedbacks({
            type: "all",
            spaceId: params.projectId,
          })
        : Promise.resolve([]);

    const [feedbacksRes, socialFeedbacksRes] = await Promise.all([
      feedbacks,
      socialFeedbacks,
    ]);
    const resolvedfeedbacks = feedbacksRes ? feedbacksRes.documents : [];
    const resolvedSocialFeedbacks = socialFeedbacksRes
      ? socialFeedbacksRes
      : [];
    const isNext = feedbacksRes.isNext;
    return (
      <PaginatedView
        isNext={isNext}
        baseLink={`${params.projectId}/share/feedback`}
      >
        <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
          {resolvedSocialFeedbacks.map((feedback) => (
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
                  id: feedback.$id,
                }}
              />
            </div>
          ))}
          {resolvedfeedbacks.map((feedback) => (
            <div className="max-w-sm mb-2">
              <Feedbackcard
                key={feedback.$id}
                email={feedback.userEmail}
                feedback={feedback.feedback}
                stars={feedback.stars}
                name={feedback.name}
                wallOfFame={feedback.wall_of_fame}
                id={feedback.$id}
              />
            </div>
          ))}
        </section>
      </PaginatedView>
    );
  } catch (error) {
    return <h1>Some error occured</h1>;
  }
}
