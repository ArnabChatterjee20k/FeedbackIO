"use server";
import { getPermissions } from "@/lib/server/feedback-backend/permissions";
import AddMembers from "./add-members";
import { Suspense} from "react";

export default async function MembersList({ projectId }: { projectId: string }) {
  return (
    <Suspense fallback={<AddMembers disabled={true} data={[]} document_id={projectId} />}>
      <MembersListContent projectId={projectId} />
    </Suspense>
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