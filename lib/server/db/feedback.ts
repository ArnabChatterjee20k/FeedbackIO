import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { DB_ID, FEEDBACK_COL_ID, SOCIAL_COL_ID, SPACES_COL_ID } from "./config";
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
    spaceId: string;
  };
}
export async function isFeedbackGivenByTheUser({
  checks: { userID, ip, spaceId },
}: FeedbackGivenCheckParams) {
  if (!userID && !ip) return false;
  const { db } = await createAdminClient();
  const queries = [];
  if (userID) queries.push(Query.equal("userID", userID));
  if (ip) queries.push(Query.equal("userIP", ip));
  // check if both are userId and ip needs to be track then it will be an or operation -> if ip or id is present
  // if only ip or only userId is present then no or required
  const userQuery = queries.length > 1 ? Query.or(queries) : queries[0];
  const spaceQuery = Query.equal("space_id", spaceId);
  const finalQuery = [Query.and([spaceQuery, userQuery])];

  try {
    const feedbacks = await db.listDocuments(
      DB_ID,
      FEEDBACK_COL_ID,
      finalQuery
    );
    if (feedbacks.total > 0) return true;
  } catch (error) {
    console.error("Error fetching feedback given or not ", {
      userID,
      ip,
      spaceId,
    });
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
  $id: string;
  wall_of_fame: boolean;
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
  limit = 25,
}: FeedbackQueryParams): Promise<FeedbackResponse> {
  try {
    const { db } = await createSessionClient();
    const queryConditions = [Query.equal("space_id", space_id)];

    if (typeof liked === "boolean") {
      queryConditions.push(Query.equal("wall_of_fame", liked));
    }

    const finalQuery = [
      queryConditions.length > 1
        ? Query.and(queryConditions)
        : queryConditions[0],

      Query.limit(limit + 1), // Get one extra to check for next page
      Query.offset((page - 1) * limit),
    ];

    const response = await db.listDocuments(
      process.env.DB_ID!,
      process.env.FEEDBACK_COL_ID!,
      finalQuery
    );

    // Check if there's a next page
    const hasNext = response.documents.length > limit;

    return {
      documents: response.documents.slice(
        0,
        limit
      ) as unknown[] as FeedbackAttributes[], // Remove the extra document
      total: response.total,
      isNext: hasNext,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch feedbacks: ${error.message}`);
    }
    throw new Error("Failed to fetch feedbacks");
  }
}

interface SocialFeedbackProps {
  type: "linkedin" | "twitter" | "all";
  wallOfFame?: boolean;
  spaceId: string;
  error?: boolean;
}
export async function getSocialFeedbacks({
  type,
  spaceId,
  wallOfFame,
}: SocialFeedbackProps) {
  try {
    const { db } = await createAdminClient();
    const queries = [Query.equal("space_id", spaceId)];
    if (type !== "all") {
      queries.push(Query.equal("type", type));
    }
    if (wallOfFame) {
      queries.push(Query.equal("wall_of_fame", true));
    }
    const data = await db.listDocuments(DB_ID, SOCIAL_COL_ID, queries);
    return data.documents;
  } catch {
    return null;
  }
}

export async function addSocialLinkToQueue(
  url: string,
  space_id: string,
  type: "twitter" | "linkedin"
) {
  try {
    const { db } = await createSessionClient();
    const doc = await db.createDocument(DB_ID, SOCIAL_COL_ID, ID.unique(), {
      url,
      space_id,
      type,
    });
    return doc.$id;
  } catch (error) {
    console.error("error occured while adding social integration ", error);
    return null;
  }
}

export async function toggleWallOfFame(
  id: string,
  type: "twitter" | "linkedin" | "feedback",
  wallOfFame: boolean
) {
  try {
    const { db } = await createSessionClient();
    const colID = type === "feedback" ? FEEDBACK_COL_ID : SOCIAL_COL_ID;
    const doc = await db.updateDocument(DB_ID, colID, id, {
      wall_of_fame: wallOfFame,
    });
    console.log({ doc });
    return doc.$id;
  } catch (error) {
    console.error("error occured while adding social integration ", error);
    return null;
  }
}

export async function getAllWallOfFameFeedbacks(space_id: string) {
  try {
    const { db } = await createAdminClient();
    const doc = await db.listDocuments(DB_ID, FEEDBACK_COL_ID, [
      Query.and([
        Query.equal("wall_of_fame", true),
        Query.equal("space_id", space_id),
      ]),
    ]);
    return doc.documents;
  } catch (error) {
    return null;
  }
}
