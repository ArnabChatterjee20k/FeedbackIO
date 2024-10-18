"use server";
import { redirect } from "next/navigation";
import { spaceFormSchema, type SpaceFormType } from "../schema";
import landingPageSchema from "../schema/landing-page.schema";
import notificationSchema from "../schema/notification.schema";
import settingsSchema from "../schema/setting.schema";
import thankYouPageSchema from "../schema/thank-you-page.schema";
import { createSpacePages } from "@/lib/server/db/spaces";

export type SpaceFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export default async function createSpaceAction(
  data: SpaceFormType
): Promise<SpaceFormState> {
  const schemaValidations = [
    {
      key: "Landing Page",
      schema: landingPageSchema,
      data: data.landingPageSchema,
      schemaName:"landingPageSchema"
    },
    { key: "Settings", schema: settingsSchema, data: data.settingsSchema , schemaName:"settingsSchema"},
    {
      key: "Thank You Page",
      schema: thankYouPageSchema,
      data: data.thankYouPageSchema,
      schemaName: "thankYouPageSchema",
    },
    {
      key: "Notification",
      schema: notificationSchema,
      data: data.notificationSchema,
      schemaName:"notificationSchema"
    },
  ];
  const validationResults = await Promise.all(
    schemaValidations.map(async ({ key, schema, data,schemaName }) => {
      const result = await schema.safeParseAsync(data);
      return { key, result,schemaName };
    })
  );

  const errors: Record<string, string[]> = {};

  const validatedData = {};
  validationResults.forEach(({ key, result,schemaName }) => {
    if (!result.success) {
      errors[key] = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
    } else {
      // @ts-ignore
      validatedData[schemaName] = result.data;
    }
  });

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Validation failed",
      errors,
    };
  }
  createSpacePages("arnab", validatedData);

  // redirect("/dashboard/1");
}
