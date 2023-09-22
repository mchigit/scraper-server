import puppeteer, { Browser } from "puppeteer-core";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import AdBlockPlugin from "puppeteer-extra-plugin-adblocker";
// import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import UserAgent from "user-agents";

const userAgent = new UserAgent();

// puppeteer.use(StealthPlugin());
// puppeteer.use(AdBlockPlugin({ blockTrackers: true }));
// puppeteer.use(
//   RecaptchaPlugin({
//     provider: {
//       id: "2captcha",
//       token: "XXXXXXX", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
//     },
//     visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
//   })
// );

import { CHROME_ENDPOINT } from "../constants";

export class PuppeteerBrowser {
  private static browser: Browser | null = null;

  static async getNewPage() {
    if (!PuppeteerBrowser.browser) {
      console.log("Launching Chrome...", CHROME_ENDPOINT);
      PuppeteerBrowser.browser = await puppeteer.connect({
        browserWSEndpoint: CHROME_ENDPOINT,
        ignoreHTTPSErrors: true,
      });
    }

    const page = await PuppeteerBrowser.browser.newPage();
    // await page.setRequestInterception(true);

    // page.on("request", (request) => {
    //   if (["image", "font"].indexOf(request.resourceType()) !== -1) {
    //     request.abort();
    //   } else {
    //     request.continue();
    //   }
    // });
    await page.setUserAgent(userAgent.toString());

    return page;
  }

  static async close() {
    if (PuppeteerBrowser.browser) {
      console.log("Shutting down Chrome...");
      await PuppeteerBrowser.browser.close();
    }
  }
}
