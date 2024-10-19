"use server";
import { ID, Models } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import { DB_ID, SPACES_COL_ID } from "./config";
import { DB_RESPONSE } from "./types";
import { SpaceFormType } from "@/app/(dashboard)/dashboard/space/schema";
import { rollback } from "../utils";

export async function getSpaces(userId: string) {
  const { db } = await createSessionClient();
  const spaces = await db.listDocuments(DB_ID, SPACES_COL_ID);
  return spaces.documents;
}

export async function createSpace(
  userId: string,
  name: string,
  logo: string
): Promise<DB_RESPONSE> {
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
): Promise<DB_RESPONSE> {
  const { db } = await createSessionClient();
  const {
    landingPageSchema,
    notificationSchema,
    settingsSchema,
    thankYouPageSchema,
  } = data;

  const action: Record<string, ()=>Promise<Models.Document>> = {
    landingPage: ()=> db.createDocument(
      DB_ID,
      process.env.LANDING_PAGE_COL_ID!,
      ID.unique(),
      { ...landingPageSchema, space_id: spaceId }
    ),
    settings:()=> db.createDocument(
      DB_ID,
      process.env.SETTINGS_COL_ID!,
      ID.unique(),
      { ...settingsSchema, space_id: spaceId }
    ),
    notifications:()=> db.createDocument(
      DB_ID,
      process.env.NOTIFICATIONS_COL_ID!,
      ID.unique(),
      { ...notificationSchema, space_id: spaceId }
    ),
    thankYou: ()=>db.createDocument(
      DB_ID,
      process.env.THANK_YOU_COL_ID!,
      ID.unique(),
      { ...thankYouPageSchema, space_id: spaceId }
    ),
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
