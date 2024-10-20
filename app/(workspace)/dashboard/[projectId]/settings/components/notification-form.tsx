import FormBuilder, { FieldConfig } from "./form-builder";

export default function NotificationForm() {
    const formConfig: FieldConfig[] = [
        {
          name: "emailOnFeedback",
          label: "Enable email on feedback",
          type: "toggle",
          path: "notificationSchema.emailOnFeedback",
        },
        {
          name: "emailTemplate",
          label: "Email Template",
          type: "longText",
          path: "notificationSchema.emailTemplate",
        },
      ];
    
  return <FormBuilder page="notificationSchema" config={formConfig} />;
}
