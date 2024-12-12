"use server";
import { deletePermission } from "@/lib/server/feedback-backend/permissions";
import { PermissionEnum, TypeEnum } from "../types/types";
export default async function ({
  document_id,
  user_id,
  permissionLevel,
}: {
  document_id: string;
  user_id: string;
  permissionLevel: PermissionEnum[];
}) {
  const isDeleted = await deletePermission(
    document_id,
    user_id,
    permissionLevel[0],
    TypeEnum.FEEDBACK
  );
  return isDeleted;
}
