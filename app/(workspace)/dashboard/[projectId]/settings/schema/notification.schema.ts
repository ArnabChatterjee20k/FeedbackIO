import { z } from "zod";

const notificationSchema = z.object({
  emailOnFeedback: z.boolean().default(false),
  emailTemplate: z.string().default("Thanks for your feedback"),
});

export default notificationSchema;
