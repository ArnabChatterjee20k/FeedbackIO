"use server";
import { getPermissions } from "@/lib/server/feedback-backend/permissions";
import Empty from "@/components/empty";
import AddMembers from "./add-members";
import { getUser } from "@/lib/server/utils";

export default async function MembersList({
  projectId,
}: {
  projectId: string;
}) {
  const permissionsData = await getPermissions({ document_id: projectId });
  return (
    <AddMembers data={permissionsData?.data || []} document_id={projectId}/>
  );
}
