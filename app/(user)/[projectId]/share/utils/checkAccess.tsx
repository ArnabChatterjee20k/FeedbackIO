import { PermissionEnum } from "@/app/(workspace)/space/[projectId]/feedbacks/types/types";
import { getSpace } from "@/lib/server/db/spaces";
import { getPermissions } from "@/lib/server/feedback-backend/permissions";
import { getUser } from "@/lib/server/utils";

export interface IAccess {
  document_id: string;
  user_id: string;
}

export default async function checkAccess({ document_id, user_id }: IAccess) {
  const [permissions, owner] = await Promise.allSettled([
    getPermissions({
      document_id,
      user_id,
      permission: PermissionEnum.READ,
    }),
    isOwner(document_id),
  ]);
  if (owner.status === "fulfilled" && owner.value) return true;
  if (
    permissions.status === "rejected" ||
    permissions.value?.data.length == 0 ||
    permissions.value?.data[0].user_id !== user_id
  )
    return false;
  return true;
}

async function isOwner(document_id: string) {
  const user = await getUser();
  if (user) {
    const space = await getSpace(user.$id, document_id);
    return space ? true : false;
  }
  return false;
}
