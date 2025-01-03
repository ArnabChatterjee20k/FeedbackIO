import { z } from "zod";
import logoSchema from "./logo.schema";

const questionSchema = z
  .array(z.string())
  .default([
    "💡 What features would you like to see?",
    "🚀 How can we improve our service?",
    "🔧 What tools do you need for your workflow?",
  ]);

export const landingPageFieldschema = z.object({
  logo: logoSchema.default(
    "https://g-0ea4boehcqr.vusercontent.net/placeholder.svg?height=80&width=80"
  ),
  name: z
    .string()
    .min(1, "Space name is required")
    .max(100, "Within 100 characters")
    .default("Space name"),
  message: z
    .string()
    .min(1, "Space message is required")
    .max(1000, "Within 1000 characters")
    .default(
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed tempora quia animi magnam earum ipsam voluptatem eveniet quibusdam molestiae ut numquam aliquam, beatae iure quam eum laudantium corrupti, qui minima!"
    ),
  primaryColor: z.string().default("#000000"),
  questionSection: z.boolean().default(true),
  questions: questionSchema,
  buttonText: z
    .string()
    .min(1, "button text is required")
    .max(40, "Button characters must be within 40 characters")
    .default("Share your valuable feedback"),
});
const landingPageSchema = landingPageFieldschema.superRefine((data, ctx) => {
  if (data.questionSection === true && !data.questions.length) {
    ctx.addIssue({
      path: ["landingPageSchema.questionSection"],
      message: "Questions are required",
      code: z.ZodIssueCode.custom,
    });
  }
});

export default landingPageSchema;
