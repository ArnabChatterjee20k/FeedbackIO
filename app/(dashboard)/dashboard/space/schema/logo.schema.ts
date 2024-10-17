import { z } from "zod";
const ONE_MB = 1 * 1024 * 1024;
const logoSchema = z
  .instanceof(File)
  .refine((file) => file.size <= ONE_MB, {
    message: "File size should be less than 1MB",
  })
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "Only JPG or PNG images are allowed",
  });

export default z.union([z.string().default(""), logoSchema]);
