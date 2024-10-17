import { z } from "zod";

const settingsSchema = z.object({
  ipEnabledReview: z.boolean().default(false),
  authEnabledReview: z.boolean().default(false),
  nameRequired: z.boolean().default(true),
  starRatingRequired: z.boolean().default(true),
});
export default settingsSchema;
