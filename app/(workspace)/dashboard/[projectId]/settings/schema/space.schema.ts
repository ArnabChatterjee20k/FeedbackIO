import { z } from "zod";

export const spaceSchema = z.object({
    space_name:z.string(),
    logo:z.string(),
})