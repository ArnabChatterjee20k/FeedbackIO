"use server"
import { Models } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import {DB_ID,SPACES_COL_ID} from "./config";
import { Space } from "./types";

export async function getSpaces(userId:string){
    const {db} = await createSessionClient()
    const spaces = await db.listDocuments<Space>(DB_ID,SPACES_COL_ID)
    return spaces.documents
}