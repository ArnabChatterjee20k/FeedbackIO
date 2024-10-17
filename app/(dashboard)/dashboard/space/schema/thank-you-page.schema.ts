import { z } from "zod";
const thankYouPageSchema = z.object({
  title: z.string().default("Thank You"),
  message: z.string().default("We appreciate your feedback!"),
});

export default thankYouPageSchema;
