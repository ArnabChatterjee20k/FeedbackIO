import React, { useEffect } from "react";
import FormBuilder, { FieldConfig } from "./form-builder";
import { useProjectContext } from "../context/ProjectContextProvider";
import { toast } from "sonner";

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
  const {
    methods: { formState },
  } = useProjectContext();
  const errors = formState["errors"]?.landingPageSchema as Record<
    string,
    Record<string, Record<string, string>>
  >;
  const isQuestionSectionError = errors?.landingPageSchema?.questionSection;
  // since the question toast was rendering twice so used useEffect
  useEffect(() => {
    if (isQuestionSectionError) {
      toast.warning("Questions not provided", {
        description: "Either disable questions or add questions",
        dismissible: true,
        duration: 1000
      });
    }
  }, [isQuestionSectionError]);
  return <FormBuilder page="landingPageSchema" config={formConfig} />;
}
