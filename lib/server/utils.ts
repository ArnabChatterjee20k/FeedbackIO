import { createAdminClient, createSessionClient } from "./appwrite";
import { DB_ID } from "./db/config";
export async function getUser(token?: string) {
  try {
    const client = token
      ? await createSessionClient(token)
      : await createSessionClient();
    if (!client) return null;
    return await client.account.get();
  } catch (error) {
    return null;
  }
}

export async function rollback(
  createdDocs: { docId: string; colId: string }[]
) {
  const { db } = await createSessionClient();
  console.warn("Rolling back: ", createdDocs);
  for (const doc of createdDocs) {
    console.log("rolling back");
    try {
      await db.deleteDocument(DB_ID, doc.colId, doc.docId);
    } catch (rollbackError) {
      console.error(
        `Error during rollback for document ${doc.docId}:`,
        rollbackError
      );
    }
  }
}

export async function rollbackFile(fileId: string) {
  const bucketId = process.env.BUCKET_ID as string;
  console.warn("Rolling back: ", fileId);
  try {
    const { storage } = await createAdminClient();
    storage.deleteFile(bucketId, fileId);
  } catch (rollbackError) {
    console.error("Error during rolling back", rollbackError);
  }
}
