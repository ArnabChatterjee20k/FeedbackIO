import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { createClient } from "../../client/appwrite";
import { SERVER_RESPONSE } from "../db/types";
export async function upload(file: File): Promise<SERVER_RESPONSE & {fileURL:string,fileId:string}> {
  try {
    const bucketID = process.env.BUCKET_ID as string;
    const { storage } = await createAdminClient();
    const createdFile = await storage.createFile(bucketID, ID.unique(), file);
    const fileId = createdFile.$id;
    const fileURL = await getFilePreview(fileId);
    if(!fileURL) throw Error("File upload url not came ")
    return { message: "File created", success: true, fileURL ,fileId};
  } catch (error) {
    console.error("File upload error ",error)
    return { message: "File error", success: false ,fileURL:"",fileId:""};
  }
}

export async function getFilePreview(fileId: string) {
  const bucketID = process.env.BUCKET_ID as string;
  const { storage } = await createClient();
  return storage.getFilePreview(bucketID, fileId);
}
