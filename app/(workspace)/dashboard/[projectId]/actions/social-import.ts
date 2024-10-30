"use server";

import { addSocialLinkToQueue } from "@/lib/server/db/feedback";
import { tasks } from "@trigger.dev/sdk/v3";
import { revalidatePath } from "next/cache";

export interface ImportResponse {
  error: string;
}

export async function importTweet(
  url: string,
  space_id: string,
  path: string
): Promise<ImportResponse> {
  const pattern = /^https:\/\/x\.com\/\w+\/status\/\d+$/;
  if (!pattern.test(url)) return { error: "not a valid url" };
  const id = await addSocialLinkToQueue(url, space_id, "twitter");
  if (!id) return { error: "some error occured" };
  await tasks.trigger("twitter-scrapper", { url, spaceId: space_id, id: id });
  revalidatePath(path);
  return { error: "" };
}

export async function importLinkedIn(
  url: string,
  space_id: string,
  path: string
): Promise<ImportResponse> {
  const pattern =
    /^https?:\/\/(www\.)?linkedin\.com\/(feed\/update\/urn:li:activity:\d+|posts\/[\w-]+\/[\w-]+-activity-\d+)(\/|(\?|#).*)?$/;
  if (!pattern.test) return { error: "not a valid linkedin post url" };
  // it will be automatically trigger appwrite functions to scrape
  const id = await addSocialLinkToQueue(url, space_id, "linkedin");
  if (!id) return { error: "some error occured" };
  revalidatePath(path);
  return { error: "" };
}
