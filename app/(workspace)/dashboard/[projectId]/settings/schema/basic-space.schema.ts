import { z } from "zod";
import logoSchema from "./logo.schema";

export const basicSpaceSchema = z.object({
  name: z
    .string()
    .min(1, "Provide name")
    .max(20, "Maximum 20 characters for name"),
  message: z
    .string()
    .min(1, "Provide space message")
    .max(1000, "Maximum 1000 characters for message"),
  logo: logoSchema.optional().default("https://g-0ea4boehcqr.vusercontent.net/placeholder.svg?height=80&width=80"),
});

export type BasicSpaceSchema = z.infer<typeof basicSpaceSchema>;
