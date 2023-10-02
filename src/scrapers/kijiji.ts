import { Page } from "puppeteer-core";
import { KijijiReqDataType } from "../types";

const username = "dychi1997@gmail.com";
const password = "google@88";

const getUnitTypeToString = (unitType: string) => {
  switch (unitType) {
    case "condo":
    case "apartment":
      return "Condo";
    case "house":
    case "detached":
      return "独立屋";
    case "townhouse":
      return "镇屋";
    case "semiDetached":
      return "半独立屋";
    default:
      return "独立屋";
  }
};

export const loginToKijiji = async (page: Page) => {
  await page.goto("https://www.kijiji.ca/t-login.html");

  await page.waitForNavigation();

  // Fill in the username and password
  await page.type("#emailOrNickname", username);
  await page.type("#password", password);

  // // Click the login button
  await page.click('#LoginForm button[type="submit"]');

  await page.waitForNavigation();
};

export const createLongtermRental = async (
  page: Page,
  data: KijijiReqDataType
) => {
  const url = `https://www.kijiji.ca/p-post-ad.html?categoryId=37&adTitle=${data.adTitle}`;
  await page.goto(url);

  console.log("Filling out ad form ==========");

  await page.type("#PriceAmount", data.rent.toString());
  await page.type("#pstad-descrptn", data.description);
};
