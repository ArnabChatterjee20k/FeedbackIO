import { z } from "zod";

const settingsSchema = z.object({
  ipEnabledReview: z.boolean().optional().default(false),
  authEnabledReview: z.boolean().optional().default(false),
  nameRequired: z.boolean().optional().default(true),
  starRatingRequired: z.boolean().optional().default(true),
});
export default settingsSchema;
