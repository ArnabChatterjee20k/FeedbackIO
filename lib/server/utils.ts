import { createSessionClient } from "./appwrite";
import { DB_ID } from "./db/config";
export async function getUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function rollback(createdDocs:{ docId: string; colId: string }[]){
  const {db} = await createSessionClient()
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

}