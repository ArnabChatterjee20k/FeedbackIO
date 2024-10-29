import { AppwriteException, Models} from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { DB_ID, LANDING_PAGE_COL_ID } from "./config";
import { SERVER_FETCH_RESPONSE } from "./types";
import { type LandingSectionProps } from "@/components/landing-page";
export default async function getLandingPage(space_id: string):Promise<SERVER_FETCH_RESPONSE< LandingSectionProps>> {
  const { db } = await createAdminClient();
  try {
    const doc = await db.getDocument(DB_ID, LANDING_PAGE_COL_ID, space_id);
    return { success:true,docs:doc as LandingSectionProps & Models.Document ,message:"successful",status:200 };
  } catch (error) {
    if(error instanceof AppwriteException){
        console.error("Appwrite exception ", error);
        return { status: error.code as number,docs:null,message:"Some error occured while fetching the page",success:false };
    }
    return { status: 500 as number,docs:null,message:"Some error occured while fetching the page",success:false };
  }
}