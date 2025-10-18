"use server";
import { getPermissions } from "@/lib/server/feedback-backend/permissions";
import AddMembers from "./add-members";
import { Suspense} from "react";
import TempShareButton from "../temp-share-button";

export default async function MembersList({ projectId }: { projectId: string }) {
  return (
    <div className="flex gap-2 items-center">
      <TempShareButton url={`${process.env.NEXT_PUBLIC_SITE_URL}/${projectId}/share/feedback`}/>
      <Suspense fallback={<AddMembers disabled={true} data={[]} document_id={projectId} />}>
        <MembersListContent projectId={projectId} />
      </Suspense>
    </div>
  );
}

async function MembersListContent({
  projectId,
}: {
  projectId: string;
}) {
  const permissionsData = await getPermissions({ document_id: projectId });

  return (
    <AddMembers
      disabled={false}
      data={permissionsData?.data || []}
      document_id={projectId}
    />
  );
}