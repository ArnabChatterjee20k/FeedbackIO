"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type SpaceFormType } from "../schema";
import landingPageSchema from "../schema/landing-page.schema";
import notificationSchema from "../schema/notification.schema";
import settingsSchema from "../schema/setting.schema";
import thankYouPageSchema from "../schema/thank-you-page.schema";
import { updatePage } from "@/lib/server/db/spaces";
import { upload } from "@/lib/server/storage/file";

export type SpaceFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type SpaceFormKey = keyof SpaceFormType;
type ValidationSchemas = Record<
  SpaceFormKey,
  z.AnyZodObject | z.ZodEffects<z.AnyZodObject>
>;

type UpdateResult = {
  success: boolean;
  message: string;
  errors?: string[];
};

const validationSchemas: ValidationSchemas = {
  landingPageSchema,
  notificationSchema,
  settingsSchema,
  thankYouPageSchema,
};

export default async function createSpaceAction(
  data: Partial<SpaceFormType>,
  file: FormData,
  spaceId: string
): Promise<SpaceFormState> {
  try {
    const logo = file?.get("logo") instanceof File ? (file.get("logo") as File) : null;

    const errors = validateFormData(data);
    if (Object.keys(errors).length) {
      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    const updates = await collectUpdates(data, logo, spaceId);
    if (!updates.length) {
      return {
        success: true,
        message: "No updates required",
      };
    }

    const results = await Promise.all(updates);
    const allErrors: string[] = [];

    // Process nested Promise.allSettled results from landing page update
    results.forEach((result) => {
      if (Array.isArray(result)) {
        // Handle landing page update results
        result.forEach((settledResult) => {
          if (settledResult.status === "rejected") {
            allErrors.push(settledResult.reason.message);
          }
        });
      } else if (!result.success) {
        // Handle other page update results
        allErrors.push(...(result.errors || [result.message]));
      }
    });

    if (allErrors.length) {
      return {
        success: false,
        message: "Some updates failed",
        errors: {
          general: allErrors,
        },
      };
    }

    revalidatePath(`/space/${spaceId}/settings`);

    return {
      success: true,
      message: "All updates completed successfully",
    };
  } catch (error) {
    console.error("Error in createSpaceAction:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      errors: {
        general: [(error as Error).message],
      },
    };
  }
}

function validateFormData(data: Partial<SpaceFormType>): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  Object.entries(data).forEach(([schemaKey, schemaData]) => {
    if (schemaData && Object.keys(schemaData).length) {
      const schema = validationSchemas[schemaKey as SpaceFormKey];
      const validation = schema.safeParse(schemaData);

      if (!validation.success) {
        errors[schemaKey] = validation.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
      }
    }
  });

  return errors;
}

async function collectUpdates(
  data: Partial<SpaceFormType>,
  logo: File | null,
  spaceId: string
): Promise<Promise<UpdateResult | PromiseSettledResult<any>[]>[]> {
  const updates: Promise<UpdateResult | PromiseSettledResult<any>[]>[] = [];

  if (hasUpdates(data.landingPageSchema)) {
    updates.push(updateLandingPage(data.landingPageSchema!, logo, spaceId));
  }

  if (hasUpdates(data.notificationSchema)) {
    updates.push(updateNotifications(data.notificationSchema!, spaceId));
  }

  if (hasUpdates(data.settingsSchema)) {
    updates.push(updateSettings(data.settingsSchema!, spaceId));
  }

  if (hasUpdates(data.thankYouPageSchema)) {
    updates.push(updateThankYou(data.thankYouPageSchema!, spaceId));
  }

  return updates;
}

function hasUpdates(
  page: Partial<SpaceFormType[SpaceFormKey]> | undefined
): boolean {
  return Boolean(page && Object.keys(page).length > 0);
}

async function updateSpaceLogo(newlogoId:string,newLogoURL: string, spaceId: string): Promise<UpdateResult> {
  try {
    await updatePage(spaceId, "space", { newFileURL: newLogoURL,newFileId:newlogoId });
    return { success: true, message: "Logo updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update space logo",
      errors: [(error as Error).message],
    };
  }
}

async function updateLandingPage(
  data: Record<string, any>,
  logo: File | null,
  spaceId: string
) {
  let logoUrl = "";
  let logoId = ""
  if (logo) {
    const { fileURL, success , fileId } = await upload(logo);
    if (!success) {
      throw new Error("Failed to upload logo");
    }
    logoUrl = fileURL;
    logoId = fileId
  }

  // Currently updating the landing page logo using event triggered by change in space logo
  // space -> update the newFileId and newFileURL -> trigger action [update space logoURL and landingpage logoURL -> delete the fileId]
  // For more consistency we can add another field success in space to track whether the field was successfully updated or not
  // And run a cron to check the false success and update them
  return Promise.allSettled([
    updatePage(spaceId, "landingPage", {
      ...data
    }),
    ...(logoUrl ? [updateSpaceLogo(logoId,logoUrl,spaceId)] : []),
  ]);
}

async function updateSettings(
  data: SpaceFormType["settingsSchema"],
  spaceId: string
): Promise<UpdateResult> {
  try {
    await updatePage(spaceId, "settingsPage", data);
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update settings",
      errors: [(error as Error).message],
    };
  }
}

async function updateNotifications(
  data: SpaceFormType["notificationSchema"],
  spaceId: string
): Promise<UpdateResult> {
  try {
    await updatePage(spaceId, "notifcationsPage", data);
    return { success: true, message: "Notifications updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update notifications",
      errors: [(error as Error).message],
    };
  }
}

async function updateThankYou(
  data: SpaceFormType["thankYouPageSchema"],
  spaceId: string
): Promise<UpdateResult> {
  try {
    await updatePage(spaceId, "thankYou", data);
    return { success: true, message: "Thank you page updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update thank you page",
      errors: [(error as Error).message],
    };
  }
}