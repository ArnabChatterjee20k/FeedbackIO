export const dynamic = "force-dynamic";
import axios, { AxiosError } from "axios";
import { FEEDBACK_BACKEND_URL, feedbackBackendDefaultHeader } from "./config";
import { generateURL } from "@/lib/utils";
import {
  type PermissionResponse,
  GetPermissions,
  Permissions,
} from "@/app/(workspace)/space/[projectId]/feedbacks/types/types";
export async function getPermissions({
  document_id,
  user_id,
}: GetPermissions): Promise<PermissionResponse | null> {
  try {
    const url = `${FEEDBACK_BACKEND_URL}/permissions`;
    const updatedURL = generateURL(url, {
      document_id,
      ...(user_id ? { user_id: user_id } : {}),
    });
    const headers = feedbackBackendDefaultHeader;
    const res = await axios.get(updatedURL, { headers });
    return res.data;
  } catch (e) {
    console.error("Error occured ");
    if (e instanceof AxiosError) {
      console.error({ status: e.status, data: e.response?.data || "" });
    }
    return null;
  }
}

export async function createPermissions(data: Permissions[]) {
  try {
    const url = `${FEEDBACK_BACKEND_URL}/permissions`;
    const headers = feedbackBackendDefaultHeader;
    const res = await axios.post(url, {permissions:data}, { headers });
    return true;
  } catch (e) {
    if (e instanceof AxiosError) {
      console.error({ status: e.status, data: e.response?.data || "" });
    }
    return false;
  }
}
