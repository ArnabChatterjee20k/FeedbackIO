import { getSocialFeedbacks } from "@/lib/server/db/feedback";
import SocialCard from "../../components/social-card";
export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const feedbacks = await getSocialFeedbacks({
    type: "twitter",
    spaceId: params.projectId,
  });
  return (
    <div>
      {feedbacks.map((feedback) => (
        <SocialCard
          post={{
            space_id: params.projectId,
            type: "twiiter",
            content: feedback.content,
            userProfilePicture: feedback.userProfilePicture,
            url: feedback.url,
            contentImage: feedback.contentImage,
            name: feedback.name,
            tag: feedback.tag,
            wall_of_fame: feedback.wall_of_fame,
          }}
        />
      ))}
    </div>
  );
}
