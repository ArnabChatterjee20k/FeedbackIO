"use server";
import { ID, Models } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import { DB_ID, SPACES_COL_ID } from "./config";
import { Space } from "./types";
import { SpaceFormType } from "@/app/(dashboard)/dashboard/space/schema";

export async function getSpaces(userId: string) {
  const { db } = await createSessionClient();
  const spaces = await db.listDocuments<Space>(DB_ID, SPACES_COL_ID);
  return spaces.documents;
}

export async function createSpace(userId: string, name: string, logo: string) {}

export async function createSpacePages(spaceId: string, data: SpaceFormType) {
    console.log({spaceId})
  const { db } = await createSessionClient();
  const {
    landingPageSchema,
    notificationSchema,
    settingsSchema,
    thankYouPageSchema,
  } = data;

  console.log({ ...notificationSchema, "space_id": spaceId })

  const action: Record<string, Promise<Models.Document>> = {
    landingPage: db.createDocument(
      DB_ID,
      process.env.LANDING_PAGE_COL_ID!,
      ID.unique(),
      { ...landingPageSchema, "space_id": spaceId }
    ),
    settings: db.createDocument(
      DB_ID,
      process.env.SETTINGS_COL_ID!,
      ID.unique(),
      { ...settingsSchema, "space_id": spaceId }
    ),
    notifications: db.createDocument(
      DB_ID,
      process.env.NOTIFICATIONS_COL_ID!,
      ID.unique(),
      { ...notificationSchema, "space_id": spaceId }
    ),
    thankYou: db.createDocument(
      DB_ID,
      process.env.THANK_YOU_COL_ID!,
      ID.unique(),{ ...thankYouPageSchema, "space_id": spaceId }
    ),
  };
  const createdDocs: { docId: string; colId: string }[] = [];

  try {
    for (const [collection, promise] of Object.entries(action)) {
      const insertion = await promise;
      createdDocs.push({
        docId: insertion.$id,
        colId: insertion.$collectionId,
      });
    }
    return { success: true, createdDocs };
  } catch (error) {
    // rollback
    console.error("Error creating documents:", error);
    console.warn("Rolling back: ",createdDocs)
    for (const doc of createdDocs) {
        console.log("rolling back")
      try {
        await db.deleteDocument(DB_ID, doc.colId, doc.docId);
      } catch (rollbackError) {
        console.error(
          `Error during rollback for document ${doc.docId}:`,
          rollbackError
        );
      }
    }

    return {
      success: false,
      error: "Failed to create all documents. Changes rolled back.",
    };
  }
}
