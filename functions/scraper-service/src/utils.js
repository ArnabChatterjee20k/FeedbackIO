import {chromium as playwright} from "playwright-core"
import chromium from "@sparticuz/chromium-min"

const userProfileImage =
  'xpath=/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div/div/article/div/div/div[2]/div[1]/div/div/div/div/div[2]/div/div[2]/div/a/div[3]/div/div[2]/div/img';
const content =
  'xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[1]/div/div';
export async function scrape(url){
    const data = {}
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.goto(url)
    console.log(await page.title())
    data["image"] = await page.locator(userProfileImage).getAttribute("src",{timeout:2000})
    data["content"] = await page.locator(content).textContent({timeout:2000})
    await browser.close()

    return data
}

async function getBrowser(){
    return await playwright.launch({
        args:chromium.args,
        executablePath:await chromium.executablePath(`https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar`),
        headless:true,
    })

}