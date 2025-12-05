import { createAdminClient } from "../appwrite";
import { SERVER_FETCH_RESPONSE, SERVER_RESPONSE } from "./types";
import { DB_ID, API_KEY_COL_ID } from "./config";
import { ID, Query } from "node-appwrite";
import { createJWT, verifyJWT } from "../tokens/get-token";

export interface APIKeyBody {
  space_id: string;
  api_key: string;
}

export interface APIKeyResponse{
  space_id: string;
  api_key: string;
  createdAt:string;
  apiKeyid:string;
}

export async function createApiKey({
  space_id,
  api_key,
}: APIKeyBody): Promise<SERVER_RESPONSE> {
  const { db } = await createAdminClient();
  try {
    const { $id: docId } = await db.createDocument(
      DB_ID,
      API_KEY_COL_ID,
      ID.unique(),
      { space_id, api_key }
    );
    return {
      message: "Successfully created the api key",
      success: true,
      docId: docId,
    };
  } catch (error) {
    console.error("Error while creating api key ", error);
    return { message: "Error", success: false, docId: "" };
  }
}

export async function getAPIKeys(space_id: string): Promise<APIKeyResponse[]> {
  const { db } = await createAdminClient();
  const queryConditions = [Query.equal("space_id", space_id)];
  const apiKeys = await db.listDocuments(
    DB_ID,
    API_KEY_COL_ID,
    queryConditions
  );

  return apiKeys.documents.map((doc) => {
    return { 
      api_key: doc.api_key, 
      space_id: doc.space_id, 
      createdAt: typeof doc.$createdAt === 'string' ? doc.$createdAt : new Date(doc.$createdAt).toISOString(), 
      apiKeyid: doc.$id 
    };
  });
}
