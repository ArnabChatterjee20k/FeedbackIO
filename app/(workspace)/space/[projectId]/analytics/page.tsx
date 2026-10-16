import { getSpace } from "@/lib/server/db/spaces";
import { getUser } from "@/lib/server/utils";
import Analytics from "./analytics";

export default async function Page({
  params: { projectId },
}: {
  params: { projectId: string };
}) {
  const user = await getUser();
  const space = user ? await getSpace(user.$id, projectId) : null;
  return <Analytics spaceId={projectId} spaceName={space?.name} />;
}
