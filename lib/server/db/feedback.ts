import { createAdminClient } from "../appwrite";
import { DB_ID, FEEDBACK_COL_ID } from "./config";
import { getSettings } from "./settings";

export async function addFeedback(space_id:string){
    const {db} = await createAdminClient()
    const settings = await getSettings(space_id)
    const {docs,status} = settings
    if(status!==200) return {}
}