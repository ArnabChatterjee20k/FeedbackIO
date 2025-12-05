"use server";

import { createApiKey } from "@/lib/server/db/api-key";
import { ImportResponse } from "./social-import";
import { revalidatePath } from "next/cache";
import { createJWT } from "@/lib/server/tokens/get-token";

// TODO: hack for now to use the api key as JWT
// later should be changed to a secret key then using that calling the db and getting whether blocked or not
export async function createApiKeyAction(
  space_id: string,
  path: string
): Promise<ImportResponse> {
  try {
    const api_key = await createJWT({ space_id });
    const { success, message } = await createApiKey({ space_id, api_key });

    if (!success) {
      return { error: message || "Failed to create API key" };
    }
    
    revalidatePath(path);
    return { error: "" };
  } catch (error) {
    console.error("Error creating API key:", error);
    return { error: "An error occurred while creating the API key" };
  }
}
