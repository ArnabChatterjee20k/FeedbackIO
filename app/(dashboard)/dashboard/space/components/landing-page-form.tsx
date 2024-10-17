import React from "react";
import FormBuilder, { FieldConfig } from "./form-builder";

export default function LandingPageForm() {
  const formConfig: FieldConfig[] = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "text" },
    { name: "bio", label: "Biography", type: "longText" },
    { name: "newsletter", label: "Subscribe to newsletter", type: "toggle" },
    { name: "avatar", label: "Profile Picture", type: "avatar" },
    {
      name: "questions",
      label: "Survey Questions",
      type: "array",
      arrayConfig: {
        maxItems: 5,
        itemLabel: "Question",
      },
    },
  ];

  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return <FormBuilder config={formConfig} onSubmit={handleSubmit} />;
}
