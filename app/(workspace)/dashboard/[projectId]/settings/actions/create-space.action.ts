"use server";

import { createSpace, createSpacePages } from "@/lib/server/db/spaces";
import { defaultSpacePageValues } from "../schema";
import {
  BasicSpaceSchema,
  basicSpaceSchema,
} from "../schema/basic-space.schema";
import { getUser, rollback, rollbackFile } from "@/lib/server/utils";
import { signOut } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { upload } from "@/lib/server/storage/file";
import { revalidatePath } from "next/cache";

export interface DefaultSpaceFormType {
  errors: string[];
  fields?: BasicSpaceSchema;
}

export default async function createDefaultSpaceAction(
  prevState: DefaultSpaceFormType,
  formData: FormData
): Promise<DefaultSpaceFormType> {
  const user = await getUser();
  const spaceData = Object.fromEntries(formData);
  const defaultValues = defaultSpacePageValues;
  if(spaceData.logo && spaceData.logo instanceof File ){
    if(spaceData.logo.size === 0) spaceData.logo = defaultValues.landingPageSchema.logo
  }
  const parsedData = basicSpaceSchema.safeParse(spaceData);
  console.log(spaceData)
  if (!parsedData.success) {
    const errors = parsedData.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    return {
      errors,
      fields: parsedData.data,
    };
  }
  const { name, message, logo } = parsedData.data;
  let logoURL = defaultValues.landingPageSchema.logo;
  let logoId = ""
  if(logo instanceof File){
    const {fileURL,success,fileId} = await upload(logo)
    if(!success) return {errors:["File uploading eror. Please try again"]}
    logoURL = fileURL
    logoId = fileId
  }
  const {
    success: spaceStatus,
    colId: spaceColId,
    docId: spaceDocId,
    message: statusMessage,
  } = await createSpace(user?.$id as string, name, logoURL as string,logoId);
  if (!spaceStatus) {
    return {
      errors: [statusMessage],
      fields: parsedData.data,
    };
  }
  defaultValues["landingPageSchema"].name = name;
  defaultValues["landingPageSchema"].message = message;
  defaultValues["landingPageSchema"].logo = logoURL;
  const {
    success: pageStatus,
    message: pageMessage,
    createdDocs,
  } = await createSpacePages(spaceDocId as string, defaultValues);
  console.log({ createdDocs, pageMessage });
  // rolling back both spaces and created pages. If no docs are created then deleting only the space
  if (!pageStatus) {
    const allCreatedDocs = [
      ...(createdDocs?.length ? createdDocs : []),
      { docId: spaceDocId as string, colId: spaceColId as string },
    ];
    await Promise.allSettled([rollback(allCreatedDocs),rollbackFile(logoId)]);
    return {
      errors: [pageMessage],
    };
  }
  return redirect(`/dashboard/${spaceDocId}`)
}
