import { getSocialFeedbacks } from "@/lib/server/db/feedback";
import SocialCard from "../../components/social-card";
import Empty from "@/components/empty";
import { Button } from "@/components/ui/button";
import { ImportDialog } from "./components/ImportDialog";
export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const feedbacks = await getSocialFeedbacks({
    type: "twitter",
    spaceId: params.projectId,
  });
  if (!feedbacks) return <h1>Some error occured</h1>;
  if (!feedbacks.length) {
    return (
      <Empty>
        Import public tweets
        <ImportDialog />
      </Empty>
    );
  }
  return (
    <div className="space-y-6">
      <ImportDialog filled />
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
        {feedbacks.map((feedback) => (
          <div className="mb-3">
            <SocialCard
              post={{
                space_id: params.projectId,
                type: "twitter",
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
        ))}
      </div>
    </div>
  );
}
