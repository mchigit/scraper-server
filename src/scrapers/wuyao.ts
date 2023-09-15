import { Page } from "puppeteer-core";
import { HouseType } from "../types";
import { houseData } from "../constants";

const username = "rebe11";
const pass = "730101";

export const loginTo51 = async (page: Page) => {
  const loginUrl = "https://account.51.ca/login?from=https%3A%2F%2Fhouse.51.ca";

  await page.goto(loginUrl);

  await page.type("#username", username);
  await page.type("#password", pass);

  await page.click("#login-submit");

  //   await page.waitForNavigation({ waitUntil: "domcontentloaded" });
};

export const create51Rental = async (page: Page) => {
  await page.goto("https://house.51.ca/rental/publish/create");

  await page.type("#postcode", houseData.postalCode);
  await page.type('input[name="streetAddress"]', houseData.address.main);
  if (houseData.address.unit) {
    await page.type("#unit", houseData.address.unit);
  }

  await page.type('input[name="part1"]', houseData.intersection[0]);
  await page.type('input[name="part2"]', houseData.intersection[1]);

  await page.select("#bedroomTotal", houseData.rooms.toString());
  await page.select("#livingRoomTotal", houseData.livingRooms.toString());
  await page.select("#parkingTotal", houseData.parking.toString());

  await page.type("#price", houseData.price.toString());
  await page.type("#leaseTerm", houseData.leaseTerm.toString());

  await page.type("#description", houseData.description);
  await page.type("#floor", houseData.floor.toString());

  await page.evaluate((houseData) => {
    const houseType = document.querySelector(
      `input[value="${houseData.type.toLowerCase()}"]`
    ) as HTMLInputElement;
    houseType.checked = true;

    const rentalType = document.querySelector(
      `input[value="${houseData.rentalType.toLowerCase()}"]`
    ) as HTMLInputElement;
    rentalType.checked = true;

    const avaliableNow = document.querySelector(
      `input[label="立即入住"]`
    ) as HTMLInputElement;
    avaliableNow.checked = true;
  }, houseData);
};
