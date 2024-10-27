import { chromium } from 'playwright';
const userProfileImage =
  'xpath=/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div/div/article/div/div/div[2]/div[1]/div/div/div/div/div[2]/div/div[2]/div/a/div[3]/div/div[2]/div/img';
const userImage =
  '/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div/div/article/div/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/a/div/div[1]/span/span';
const content =
  'xpath=//html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[1]/div/div';
const contentImage =
  '/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[2]/div/div/div/div/div[1]/div/div/a/div/div[2]/div/img';
async function test(url) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const data = {}
  data["image"] = await page.locator(userProfileImage).getAttribute("src")
  data["content"] = await page.locator(content).textContent()

  console.log(data)
  await page.waitForTimeout(3000);
  await browser.close();
}
test('https://x.com/mannupaaji/status/1850198663093477547');
