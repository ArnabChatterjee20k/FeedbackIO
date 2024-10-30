import { logger, task, tasks, wait } from "@trigger.dev/sdk/v3";
import puppeteer, { Page } from "puppeteer";
import { saveSocialMediaFeedbacks } from "./saveSocialMediaFeedbacks";
import { Twitter } from "../types";
interface Payload {
  url: string;
  spaceId: string;
}

// with xpaths
const selectors = {
  userProfilePicture:
    "xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div/div/article/div/div/div[2]/div[1]/div/div/div/div/div[2]/div/div[2]/div/a/div[3]/div/div[2]/div/img",
  content:
    "xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[1]/div/div",
  contentImage:
    "xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[2]/div/div/div/div/div[1]/div/div/a/div/div[2]/div/img",
  userHandle:
    "xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div/div/article/div/div/div[2]/div[2]/div/div/div[1]/div/div/div[2]/div/div/a/div/span",
  userName:
    "xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div/div/article/div/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/a/div/div[1]/span/span",
};

export const scrapeTweetTask = task({
  id: "twitter-scrapper",
  maxDuration: 300, // 5 minutes
  run: async (payload: Payload, { ctx }) => {
    if (!payload.url) return { message: "url not provided" };
    const tweet = await scrapeTwitter(payload.url);
    if (tweet) {
      const {
        twitterContent,
        twitterContentImage,
        url,
        userHandle,
        userProfilePicture,
        userName,
      } = tweet;
      const spaceId = payload.spaceId;
      await tasks.trigger("save-social-media-feedbacks", {
        spaceId,
        feedback: {
          userProfilePicture: userProfilePicture,
          feedbackType: "twitter",
          userHandle,
          twitterContent,
          twitterContentImage,
          userName,
          url,
        },
      });
    }
  },
});

async function scrapeTwitter(url: string): Promise<Partial<Twitter> | null> {
  if (!isValidTwitterUrl(url)) return null;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle0" });

    // Check if the page contains the "This account's Tweets are protected" message
    const isPrivate = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      return bodyText.includes("This account's Tweets are protected");
    });

    if (isPrivate) {
      logger.log("Twitter URL is private, cannot scrape data.");
      return null;
    }

    const userProfileImage = await getImageAttribute(
      page,
      selectors.userProfilePicture
    );
    const content = await getTextContent(page, selectors.content);
    const contentImage = await getImageAttribute(page, selectors.contentImage);
    const userHandle = await getTextContent(page, selectors.userHandle);
    const userName = await getTextContent(page, selectors.userName);

    const data: Partial<Twitter> = {
      userProfilePicture: userProfileImage as string,
      twitterContent: content as string,
      twitterContentImage: contentImage as string,
      userHandle: userHandle as string,
      url,
      userName: userName as string,
      feedbackType:"twitter"
    };

    logger.log(JSON.stringify({ message: data }));
    return data;
  } catch (error: any) {
    logger.error("Error scraping Twitter:", error);
    return null;
  } finally {
    await browser.close();
  }
}

async function getImageAttribute(page: Page, xpath: string) {
  return page.$eval(xpath, (img) => img.getAttribute("src")).catch(() => "");
}

async function getTextContent(page: Page, xpath: string) {
  return page.$eval(xpath, (el) => el.textContent).catch(() => "");
}

function isValidTwitterUrl(url: string): boolean {
  // Check if the URL starts with "https://x.com/accountname/status/", followed by a number
  const pattern = /^https:\/\/x\.com\/\w+\/status\/\d+$/;
  return pattern.test(url);
}
