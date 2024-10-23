import { z } from "zod";

const notificationSchema = z.object({
  emailOnFeedback: z.boolean().optional().default(false),
  emailTemplate: z.string().optional().default("Thanks for your feedback"),
});

export default notificationSchema;
