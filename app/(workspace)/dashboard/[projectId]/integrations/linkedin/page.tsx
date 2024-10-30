import { getSocialFeedbacks } from "@/lib/server/db/feedback";
import SocialCard from "../../components/social-card";
import Empty from "@/components/empty";
import { ImportDialog } from "../../components/ImportDialog";
import { cn } from "@/lib/utils";

export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const feedbacks = await getSocialFeedbacks({
    type: "linkedin",
    spaceId: params.projectId,
  });
  if (!feedbacks) return <h1>Some error occured</h1>;
  if (!feedbacks.length) {
    return (
      <Empty>
        Import public linkedin posts
        <ImportDialog platform="linkedin"/>
      </Empty>
    );
  }
  return (
    <div className="space-y-6">
      <ImportDialog filled platform="linkedin"/>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
        {feedbacks.map((feedback) => (
          <div className="mb-3">
            <SocialCard
              className={cn(
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
              )}
              post={{
                space_id: params.projectId,
                type: "linkedin",
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
