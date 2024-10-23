"use server";
import { ID, Models, Query } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import {
  DB_ID,
  LANDING_PAGE_COL_ID,
  NOTIFICATIONS_COL_ID,
  SETTINGS_COL_ID,
  SPACES_COL_ID,
  THANK_YOU_COL_ID,
} from "./config";
import { SERVER_RESPONSE } from "./types";
import { SpaceFormType } from "@/app/(workspace)/dashboard/[projectId]/settings/schema";
import { getUser, rollback } from "../utils";

export async function getSpaces(userId: string) {
  const { db } = await createSessionClient();
  const spaces = await db.listDocuments(DB_ID, SPACES_COL_ID, [
    Query.equal("userId", userId),
  ]);
  return spaces.documents;
}

export async function getSpace(userId: string, spaceId: string) {
  const { db } = await createSessionClient();
  try {
    const spaces = await db.listDocuments(DB_ID, process.env.SPACES_COL_ID!, [
      Query.and([Query.equal("$id", spaceId), Query.equal("userId", userId)]),
    ]);
    if (spaces.total) {
      const space = spaces.documents[0];
      return { name: space.name, logo: space.logo };
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createSpace(
  userId: string,
  name: string,
  logo: string
): Promise<SERVER_RESPONSE> {
  try {
    const { db } = await createSessionClient();
    const createdSpace = await db.createDocument(
      DB_ID,
      SPACES_COL_ID,
      ID.unique(),
      {
        userId,
        name,
        logo: logo,
      }
    );

    const createdSpaceId = createdSpace.$id;
    return {
      success: true,
      message: "Successfully created space",
      docId: createdSpaceId,
      colId: SPACES_COL_ID,
    };
  } catch (error) {
    console.error("Error during creating spaces ", error);
    return {
      success: false,
      message: "Error while creating the space",
    };
  }
}

export async function createSpacePages(
  spaceId: string,
  data: SpaceFormType
): Promise<SERVER_RESPONSE> {
  const { db } = await createSessionClient();
  const {
    landingPageSchema,
    notificationSchema,
    settingsSchema,
    thankYouPageSchema,
  } = data;

  const action: Record<string, () => Promise<Models.Document>> = {
    landingPage: () =>
      db.createDocument(DB_ID, process.env.LANDING_PAGE_COL_ID!, spaceId, {
        ...landingPageSchema,
        space_id: spaceId,
        uid: ID.unique(),
      }),
    settings: () =>
      db.createDocument(DB_ID, process.env.SETTINGS_COL_ID!, spaceId, {
        ...settingsSchema,
        space_id: spaceId,
        uid: ID.unique(),
      }),
    notifications: () =>
      db.createDocument(DB_ID, process.env.NOTIFICATIONS_COL_ID!, spaceId, {
        ...notificationSchema,
        space_id: spaceId,
        uid: ID.unique(),
      }),
    thankYou: () =>
      db.createDocument(DB_ID, process.env.THANK_YOU_COL_ID!, spaceId, {
        ...thankYouPageSchema,
        space_id: spaceId,
        uid: ID.unique(),
      }),
  };
  const createdDocs: { docId: string; colId: string }[] = [];
  for (const [collection, documentInsertionAction] of Object.entries(action)) {
    try {
      const insertion = await documentInsertionAction();
      createdDocs.push({
        docId: insertion.$id,
        colId: insertion.$collectionId,
      });
    } catch (error) {
      console.error("Error creating documents:", error);
      return {
        success: false,
        message: "Failed to create all documents",
        createdDocs,
      };
    }
  }
  return { success: true, message: "All pages are created", createdDocs };
}

export async function getSpacePages(spaceId: string) {
  const { db } = await createSessionClient();
  const query = [Query.equal("space_id", spaceId), Query.limit(1)];
  const landingPageRes = db.listDocuments(DB_ID, LANDING_PAGE_COL_ID, query);
  const thankYouPageRes = db.listDocuments(DB_ID, THANK_YOU_COL_ID, query);
  const settingsPageRes = db.listDocuments(DB_ID, SETTINGS_COL_ID, query);
  const notificationPageRes = db.listDocuments(
    DB_ID,
    NOTIFICATIONS_COL_ID,
    query
  );
  try {
    // give error when any request fails
    const docs = await Promise.all([
      landingPageRes,
      thankYouPageRes,
      settingsPageRes,
      notificationPageRes,
    ]);
    const data = {
      landingPageSchema: docs[0].documents[0], // Landing page response
      thankYouPageSchema: docs[1].documents[0], // Thank you page response
      settingsSchema: docs[2].documents[0], // Settings page response
      notificationSchema: docs[3].documents[0], // Notification page response
    };
    return data;
  } catch (error) {
    return null;
  }
}

const Page = {
  thankYou: THANK_YOU_COL_ID,
  landingPage: LANDING_PAGE_COL_ID,
  settingsPage: SETTINGS_COL_ID,
  notifcationsPage: NOTIFICATIONS_COL_ID,
} as const;

export async function updatePage(
  space_id: string,
  col: keyof typeof Page,
  data: object
) {
  const COL = Page[col];
  const { db } = await createSessionClient();
  try {
    db.updateDocument(DB_ID, COL, space_id, data);
    return true;
  } catch (error) {
    console.error("error during updating ",col,error)
    return false;
  }
}
