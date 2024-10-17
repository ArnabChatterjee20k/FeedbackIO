import React from "react";
import FormBuilder, { FieldConfig } from "./form-builder";

export default function LandingPageForm() {
  const formConfig: FieldConfig[] = [
    {
      name: "name",
      label: "Space Name",
      type: "text",
      path: "landingPageSchema.name",
    },
    {
      name: "message",
      label: "Space Message",
      type: "longText",
      path: "landingPageSchema.message",
    },
    {
      name: "logo",
      label: "Space Logo",
      type: "avatar",
      path: "landingPageSchema.logo",
    },
    {
      name: "primaryColor",
      label: "Primary Color",
      type: "text",
      path: "landingPageSchema.primaryColor",
    },
    {
      name: "questionSection",
      label: "Include Questions",
      type: "toggle",
      path: "landingPageSchema.questionSection",
    },
    {
      name: "questions",
      label: "Survey Questions",
      type: "array",
      arrayConfig: {
        maxItems: 5,
        itemLabel: "Question",
      },
      path: "landingPageSchema.questions",
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "text",
      path: "landingPageSchema.buttonText",
    },
  ];
  return (
    <FormBuilder
      page="landingPageSchema"
      config={formConfig}
    />
  );
}
