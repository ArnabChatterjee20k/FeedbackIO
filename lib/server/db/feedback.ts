import { AppwriteException, ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { DB_ID, FEEDBACK_COL_ID } from "./config";
import { getSettings } from "./settings";
import { SERVER_RESPONSE } from "./types";

export interface FeedbackBody {
  name?: string;
  userID?: string;
  userIP?: string;
  stars?: number;
  userEmail?: string;
  feedback: string;
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

  const finalQuery = queries.length > 1 ? [Query.or(queries)] : queries;
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

export interface FeedbackQueryParams {
  space_id: string;
  liked?: boolean;
  page?: number;
  limit?: number;
}

interface FeedbackAttributes {
  name?: string;
  userID?: string;
  userIP?: string;
  stars?: number;
  feedback: string;
  userEmail?: string;
  space_id: string;
}

export interface FeedbackResponse {
  documents: FeedbackAttributes[];
  total: number;
  isNext: boolean;
}


export async function getAllFeedbacks({
  space_id,
  liked,
  page = 1,
  limit = 25
}: FeedbackQueryParams): Promise<FeedbackResponse> {
  try {
    const { db, account } = await createSessionClient();
    const queryConditions = [Query.equal("space_id", space_id)];

    if (typeof liked === 'boolean') {
      queryConditions.push(Query.equal("liked", liked));
    }
    
    const finalQuery = [
      queryConditions.length > 1 
        ? Query.and(queryConditions)
        : queryConditions[0],

      Query.limit(limit + 1), // Get one extra to check for next page
      Query.offset((page - 1) * limit)
    ];

    const response = await db.listDocuments(
      process.env.DB_ID!,
      process.env.FEEDBACK_COL_ID!,
      finalQuery
    );

    // Check if there's a next page
    const hasNext = response.documents.length > limit;

    return {
      documents: (response.documents.slice(0, limit) as unknown[]) as FeedbackAttributes[], // Remove the extra document
      total: response.total,
      isNext: hasNext
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch feedbacks: ${error.message}`);
    }
    throw new Error('Failed to fetch feedbacks');
  }
}