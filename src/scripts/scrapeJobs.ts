import puppeteer from "puppeteer-core";
import fs from "fs";
import { CHROME_ENDPOINT } from "../constants";
import UserAgent from "user-agents";
import { Client, ClientConfig } from "pg";

const userAgent = new UserAgent();

const linkedinUrl = `https://www.linkedin.com/jobs/search`;
const jobTitle = "full-stack engineer";
const location = "United States";

const writeToJsonFile = (filename: string, data: any) => {
  try {
    // Check if file exists
    if (fs.existsSync(filename)) {
      // File exists, read the contents
      const fileContents = fs.readFileSync(filename, "utf-8");
      const existingData = JSON.parse(fileContents);

      // Merge the new data with the existing data
      const newData = { ...existingData, ...data };

      // Write the merged data to the file
      fs.writeFileSync(filename, JSON.stringify(newData));
    } else {
      // File doesn't exist, create it and write the data
      fs.writeFileSync(filename, JSON.stringify(data));
    }
  } catch (err) {
    console.error(err);
  }
};

async function runAsyncOperationsInChunks<T>(
  array: T[],
  chunkSize: number,
  asyncOperation: (item: T, index: number) => Promise<void>
): Promise<void> {
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    await Promise.all(chunk.map(asyncOperation));
  }
}

const dbConfig: ClientConfig = {
  user: "postgres",
  password: "password",
  database: "resume_matcher_db",
  port: 5432,
  host: "localhost",
};

const chunkSize = 2;

const userAgentStr = userAgent.toString();

const scrapeJobs = async () => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: CHROME_ENDPOINT,
      ignoreHTTPSErrors: true,
    });

    const client = new Client(dbConfig);
    await client.connect();

    const page = await browser.newPage();
    await page.setUserAgent(userAgentStr);

    await page.goto(`${linkedinUrl}?keywords=${jobTitle}&location=${location}`);

    await page.waitForSelector("#main-content");

    const allJobs = await page.$$("ul.jobs-search__results-list li");
    console.log(allJobs.length);

    await runAsyncOperationsInChunks(allJobs, chunkSize, async (job, index) => {
      const jobLink = await job.$("a");
      const href = await jobLink?.evaluate((el) => el.getAttribute("href"));
      if (href) {
        const secondPage = await browser.newPage();
        await secondPage.setUserAgent(userAgentStr);
        await secondPage.goto(href);
        await secondPage.waitForSelector(
          "button.show-more-less-html__button--more"
        );

        await secondPage.click("button.show-more-less-html__button--more");
        // const jobTitle = await (await secondPage.$('h1'))?.evaluate((el) => el.textContent);

        await secondPage.screenshot({
          path: `linkedin-${index}.png`,
          fullPage: true,
        });

        const title = await secondPage.$eval("h1", (el) => el.textContent);

        await secondPage.close();
      }
    });
    const jobs = [];

    // await Promise.all(
    //   allJobs.splice(0, 5).map(async (job, index) => {
    //     const jobLink = await job.$("a");
    //     const href = await jobLink?.evaluate((el) => el.getAttribute("href"));
    //     if (href) {
    //       const secondPage = await browser.newPage();
    //       await secondPage.setUserAgent(userAgent.toString());
    //       await secondPage.goto(href);
    //       await secondPage.waitForSelector(
    //         "button.show-more-less-html__button--more"
    //       );

    //       await secondPage.click("button.show-more-less-html__button--more");
    //       // const jobTitle = await (await secondPage.$('h1'))?.evaluate((el) => el.textContent);

    //       await secondPage.screenshot({
    //         path: `linkedin-${index}.png`,
    //         fullPage: true,
    //       });

    //       await secondPage.close();
    //     }
    //   })
    // );

    // await page.screenshot({ path: "linkedin.png", fullPage: true });

    await browser.close();
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

scrapeJobs();
