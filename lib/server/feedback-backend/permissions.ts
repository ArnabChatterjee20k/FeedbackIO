export const dynamic = "force-dynamic";
import axios, { AxiosError } from "axios";
import { FEEDBACK_BACKEND_URL, feedbackBackendDefaultHeader } from "./config";
import { generateURL } from "@/lib/utils";
import {
  type PermissionResponse,
  GetPermissions,
  PermissionEnum,
  Permissions,
  TypeEnum,
} from "@/app/(workspace)/space/[projectId]/feedbacks/types/types";
import { revalidateTag, unstable_cache } from "next/cache";
export async function getPermissions({
  document_id,
  user_id,
}: GetPermissions): Promise<PermissionResponse | null> {
  try {
    const url = `${FEEDBACK_BACKEND_URL}/permissions`;
    const updatedURL = generateURL(url, {
      document_id,
      ...(user_id ? { user_id } : {}),
    });
    const headers = feedbackBackendDefaultHeader;
    const fetchPermissions = unstable_cache(
      async () => {
        try {
          const res = await axios.get(updatedURL, { headers });
          // caching the successfull data
          return res.data;
        } catch (e) {
          console.error("Error fetching permissions");
          if (e instanceof AxiosError) {
            console.error({
              status: e.response?.status,
              data: e.response?.data || "",
            });
          }
          throw new Error("Failed to fetch permissions");
        }
      },
      ["permissions", document_id, user_id || ""],
      {
        revalidate: 3600,
        tags: [`permissions_${document_id}_${user_id || ""}`],
      }
    );

    return await fetchPermissions();
  } catch (e) {
    console.error("Error in getPermissions function");
    return null;
  }
}

export async function createPermissions(data: Permissions[]) {
  try {
    const url = `${FEEDBACK_BACKEND_URL}/permissions`;
    const headers = feedbackBackendDefaultHeader;
    const res = await axios.post(url, { permissions: data }, { headers });
    data.forEach((permission) => {
      revalidateTag(
        `permissions_${permission.document_id}_${permission.user_id}`
      );
    });
    return true;
  } catch (e) {
    if (e instanceof AxiosError) {
      console.error({ status: e.status, data: e.response?.data || "" });
    }
    return false;
  }
}

export async function deletePermission(
  document_id: string,
  user_id: string,
  permissionLevel: PermissionEnum,
  type: TypeEnum
) {
  try {
    const url = `${FEEDBACK_BACKEND_URL}/permissions`;
    const headers = feedbackBackendDefaultHeader;
    const data = {
      user_id,
      document_id,
      permission: permissionLevel,
      type,
    };
    const res = await axios.delete(url, { headers, data });
    revalidateTag(`permissions_${data.document_id}_${data.user_id}`);
    return true;
  } catch (e) {
    if (e instanceof AxiosError) {
      console.error({ status: e.status, data: e.response?.data || "" });
    }
    return false;
  }
}
