"use server";

import { addSocialLinkToQueue } from "@/lib/server/db/feedback";
import { tasks } from "@trigger.dev/sdk/v3";

export interface ImportResponse {
  error: string;
}

export async function importTweet(
  url: string,
  space_id: string
): Promise<ImportResponse> {
  const pattern = /^https:\/\/x\.com\/\w+\/status\/\d+$/;
  if (!pattern.test(url)) return { error: "not a valid url" };
  const id = await addSocialLinkToQueue(url, space_id, "twitter");
  if (!id) return { error: "some error occured" };
  await tasks.trigger("twitter-scrapper", { url, spaceId: space_id, id: id });
  return { error: "" };
}

export async function importLinkedIn() {}
