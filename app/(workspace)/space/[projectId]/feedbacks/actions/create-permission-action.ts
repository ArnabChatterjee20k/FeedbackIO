"use server";

import { createPermissions } from "@/lib/server/feedback-backend/permissions";
import { PermissionEnum, TypeEnum } from "../types/types";
export default async function (
  payload: {
    document_id: string;
    member_id: string;
    permissionLevels: PermissionEnum[];
  }[]
) {
  const members = payload.map((data) => {
    return {
      document_id: data.document_id,
      user_id: data.member_id,
      permission: data.permissionLevels[0],
      type: TypeEnum.FEEDBACK,
    };
  });
  const permissionCreated = await createPermissions(members);
  return permissionCreated;
}
