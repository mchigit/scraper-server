import puppeteer, { Page } from "puppeteer";

const getTableData = async (page: Page) => {
  const dataTable = await page.$("#dgrArticles");
};

const scrape = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://cbaapps.org/ClassAction/Search.aspx");
    await page.waitForSelector("#BtnSearch");

    await page.click("#BtnSearch");

    await page.waitForNetworkIdle();

    // await page.screenshot({ fullPage: true, path: "screenshot.png" });

    await page.waitForSelector("#dgrArticles");

    await browser.close();

    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

scrape();
