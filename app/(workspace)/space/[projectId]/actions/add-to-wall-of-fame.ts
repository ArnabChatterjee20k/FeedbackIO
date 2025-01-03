"use server";

import { toggleWallOfFame } from "@/lib/server/db/feedback";
import { revalidatePath } from "next/cache";

// We can add auth step here to toggle hall of fame
// Either through permission or ownership
export default async function addToWallOfFame(
  id: string,
  type: "twitter" | "linkedin" | "feedback",
  wallOfFame: boolean,
  path: string
) {
  const toggleRes = await toggleWallOfFame(id, type, wallOfFame);
  if (toggleRes) {
    revalidatePath(path);
    return true;
  }
  return false;
}
