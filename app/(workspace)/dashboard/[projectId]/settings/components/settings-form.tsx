import React from "react";
import FormBuilder, { FieldConfig } from "./form-builder";

export default function SettingsForm() {
  const formConfig: FieldConfig[] = [
    {
      name: "nameRequired",
      label: "Name Required",
      type: "toggle",
      path: "settingsSchema.nameRequired",
    },
    {
      name: "authEnabledReview",
      label: "Auth Required",
      type: "toggle",
      path: "settingsSchema.authEnabledReview",
    },
    {
      name: "ipEnabledReview",
      label: "IP Enabled Rate Limiting",
      type: "toggle",
      path: "settingsSchema.ipEnabledReview",
    },
    {
      name: "starRatingRequired",
      label: "Stars Rating",
      type: "toggle",
      path: "settingsSchema.starRatingRequired",
    },
  ];

  return <FormBuilder page="settingsSchema" config={formConfig} />;
}
