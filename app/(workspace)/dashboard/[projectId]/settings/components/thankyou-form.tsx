import React from "react";
import FormBuilder, { FieldConfig } from "./form-builder";

export default function ThankYouForm() {
  const formConfig: FieldConfig[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      path: "thankYouPageSchema.title",
    },
    {
      name: "message",
      label: "Message",
      type: "longText",
      path: "thankYouPageSchema.message",
    },
  ];
  return <FormBuilder page="thankYouPageSchema" config={formConfig} />;
}
