"use server";
import { redirect } from "next/navigation";
import { spaceFormSchema, type SpaceFormType } from "../schema";
import landingPageSchema from "../schema/landing-page.schema";
import notificationSchema from "../schema/notification.schema";
import settingsSchema from "../schema/setting.schema";
import thankYouPageSchema from "../schema/thank-you-page.schema";
import { createSpacePages, updatePage } from "@/lib/server/db/spaces";
import { z } from "zod";
import { rollback } from "@/lib/server/utils";
import { upload } from "@/lib/server/storage/file";
import { revalidatePath } from "next/cache";

export type SpaceFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type SpaceFormKey = keyof SpaceFormType;

export default async function createSpaceAction(
  data: Record<keyof SpaceFormType, Record<string, string | File | string[]>>,
  file: FormData,
  spaceId: string
): Promise<SpaceFormState> {
  const logo =
    file?.get("logo") instanceof File ? (file?.get("logo") as File) : null;

  const validationSchemaToUse: Record<
    keyof SpaceFormType,
    z.AnyZodObject | z.ZodEffects<z.AnyZodObject>
  > = {
    landingPageSchema: landingPageSchema,
    notificationSchema: notificationSchema,
    settingsSchema: settingsSchema,
    thankYouPageSchema: thankYouPageSchema,
  };

  const errors: Record<string, string[]> = {};
  Object.keys(data).forEach((schema) => {
    if (Object.keys(data[schema as SpaceFormKey]).length) {
      const validationStatus = validationSchemaToUse[
        schema as SpaceFormKey
      ].safeParse(data[schema as SpaceFormKey]);

      if (!validationStatus.success) {
        errors[schema] = validationStatus.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
      }
    }
  });

  if (Object.keys(errors).length) {
    return {
      success: false,
      message: "Validation failed",
      errors,
    };
  }
  const updates = [];
  if (checkNeedsToBeUpdated(data.landingPageSchema)) {
    console.log("updating");
    updates.push(updateLandingPage(data.landingPageSchema, logo, spaceId));
  }

  if (checkNeedsToBeUpdated(data.notificationSchema)) {
    updates.push(updateNotifications(data.notificationSchema, spaceId));
  }

  if (checkNeedsToBeUpdated(data.settingsSchema)) {
    updates.push(updateSettings(data.settingsSchema, spaceId));
  }

  if (checkNeedsToBeUpdated(data.thankYouPageSchema)) {
    updates.push(updateLandingPage(data.thankYouPageSchema, logo, spaceId));
  }

  if (updates.length) {
    const result = await Promise.allSettled(updates);
    const errors = [];
    result.forEach((status) => {
      if (status.status === "rejected") {
        errors.push("error during updation");
      } else {
        console.log(status.value);
      }
    });
    
    return {
      success: true,
      message: "Success"
    };
  }
}

function checkNeedsToBeUpdated(page: SpaceFormType[SpaceFormKey]) {
  return Object.keys(page)?.filter((d) => d).length > 0;
}

async function updateLandingPage(
  data: SpaceFormType["landingPageSchema"],
  logo: File | null,
  space_id: string
) {
  let url = "";
  if (logo) {
    const { fileURL, success } = await upload(logo);
    url = fileURL;
    if (!success)
      return {
        success: false,
        message: "Error uploading image in landing page",
      };
  }
  return await updatePage(space_id, "landingPage", {
    ...data,
    ...(url ? { logo: url } : {}),
  });
}

async function updateSettings(
  data: SpaceFormType["settingsSchema"],
  space_id: string
) {
  return await updatePage(space_id, "settingsPage", data);
}

async function updateNotifications(
  data: SpaceFormType["notificationSchema"],
  space_id: string
) {
  return await updatePage(space_id, "notifcationsPage", data);
}

async function updateThankYOu(
  data: SpaceFormType["thankYouPageSchema"],
  space_id: string
) {
  return await updatePage(space_id, "thankYou", data);
}
