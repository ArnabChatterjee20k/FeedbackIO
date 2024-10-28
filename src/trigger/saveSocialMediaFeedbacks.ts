import { createAdminClient } from "@/lib/server/appwrite";
import { DB_ID, FEEDBACK_COL_ID } from "@/lib/server/db/config";
import { addFeedback } from "@/lib/server/db/feedback";
import { logger, task, wait } from "@trigger.dev/sdk/v3";
import { ID } from "node-appwrite";
import { Twitter } from "../types";

interface Payload {
  spaceId: string;
  feedback:Twitter
}
export const saveSocialMediaFeedbacks = task({
  id: "save-social-media-feedbacks",
  maxDuration: 300, // 5 minutes
  run: async (payload: Payload, { ctx }) => {
    const {spaceId,feedback:{feedbackType,twitterContent,url,userHandle,userName,userProfilePicture,twitterContentImage}} = payload
    const {db} = await createAdminClient()
    await db.createDocument(DB_ID,FEEDBACK_COL_ID,ID.unique(),{
      name:userName,
      userID:userHandle,
      feedback:twitterContent,
      space_id:spaceId,
      userProfilePicture,
      feedbackType:feedbackType,
      url,
      contentImage:twitterContentImage
    })
  },
});
