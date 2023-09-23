import puppeteer, { Browser } from "puppeteer-core";
import UserAgent from "user-agents";
import { KnownDevices } from "puppeteer-core";

const userAgent = new UserAgent();

import { CHROME_ENDPOINT } from "../constants";

export class PuppeteerBrowser {
  private static browser: Browser | null = null;

  static async getNewPage() {
    try {
      if (
        !PuppeteerBrowser.browser ||
        PuppeteerBrowser.browser.isConnected() === false
      ) {
        console.log("Launching Chrome...", CHROME_ENDPOINT);
        PuppeteerBrowser.browser = await puppeteer.connect({
          browserWSEndpoint: CHROME_ENDPOINT,
          ignoreHTTPSErrors: true,
        });
      }

      const page = await PuppeteerBrowser.browser.newPage();

      await page.emulate(KnownDevices["iPhone 11 Pro Max landscape"]);
      await page.setUserAgent(userAgent.toString());

      return page;
    } catch (error) {
      if (PuppeteerBrowser.browser) {
        PuppeteerBrowser.browser.disconnect();
      }
    }
  }

  static async close() {
    if (PuppeteerBrowser.browser) {
      console.log("Shutting down Chrome...");
      await PuppeteerBrowser.browser.close();
    }
  }

  static async disconnect() {
    if (PuppeteerBrowser.browser) {
      console.log("Disconnecting from Chrome...");
      await PuppeteerBrowser.browser.disconnect();
    }
  }
}
