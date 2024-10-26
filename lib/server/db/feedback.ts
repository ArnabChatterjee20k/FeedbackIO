import { AppwriteException, ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { DB_ID, FEEDBACK_COL_ID } from "./config";
import { getSettings } from "./settings";
import { SERVER_RESPONSE } from "./types";

export interface FeedbackBody{
    name?:string,
    userID?:string,
    userIP?:string,
    stars?:number,
    userEmail?:string,
    feedback:string
  }

export async function addFeedback(
  space_id: string,
  data: FeedbackBody
): Promise<SERVER_RESPONSE> {
  const { db } = await createAdminClient();
  const newFeedback = { ...data, space_id: space_id };
  try {
    const { $id: docId } = await db.createDocument(
      DB_ID,
      FEEDBACK_COL_ID,
      ID.unique(),
      newFeedback
    );
    return {
      message: "Successfully added the feedback",
      success: true,
      docId: docId,
    };
  } catch (error) {
    console.error("Error while updating feedback ", error);
    return { message: "Error", success: false, docId: "" };
  }
}

export interface FeedbackGivenCheckParams {
  checks: {
    userID?: string;
    ip?: string;
  };
}
export async function isFeedbackGivenByTheUser({
  checks: { userID, ip },
}: FeedbackGivenCheckParams) {
  if (!userID && !ip) return false;
  const { db } = await createAdminClient();
  const queries = [];
  if (userID) queries.push(Query.equal("userID", userID));
  if (ip) queries.push(Query.equal("userIP", ip));

  const finalQuery = queries.length > 1 ? [Query.and(queries)] : queries;
  try {
    const feedbacks = await db.listDocuments(
      DB_ID,
      FEEDBACK_COL_ID,
      finalQuery
    );
    if (feedbacks.total > 0) return true;
  } catch (error) {
    return true;
  }
}
