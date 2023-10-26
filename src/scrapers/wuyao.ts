import { ElementHandle, Page } from "puppeteer-core";
import { WuyaoReqDataType } from "../types";
import * as cheerio from "cheerio";
import axios from "axios";
import houseData from "./51";

const username = "michael.chi1997@gmail.com";
const pass = "google@88";

export const loginTo51 = async (page: Page) => {
  const loginUrl = "https://account.51.ca/login?from=https%3A%2F%2Fhouse.51.ca";

  await page.goto(loginUrl);

  await page.type("#username", username);
  await page.type("#password", pass);

  await page.click("#login-submit");

  await page.waitForNetworkIdle();
  //   await page.waitForNavigation({ waitUntil: "domcontentloaded" });
};

async function fetchCookiesAndMakeApiCall(
  page: Page,
  url: string,
  method: string
  // data: any
) {
  try {
    // Get the cookies from the Puppeteer page
    const cookies = await page.cookies();

    // Prepare the API request headers with the cookies
    const apiRequestHeaders: any = {
      // Set your API endpoint and other necessary headers here
      url: url,
      method: method,
      data: houseData,
      // Convert the cookies to a string and set them as a Cookie header
      headers: {
        Cookie: cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
    };

    // Make the API call using Axios
    const response = await axios(apiRequestHeaders);

    // Handle the API response as needed
    console.log("API Response:", response.data);

    // Return the response or perform any further actions
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const parseUnitType = async (unitType: string) => {
  switch (unitType) {
    case "condo":
    case "apartment":
      return "apartment";
    case "house":
    case "detached":
      return "detached";
    case "townhouse":
      return "townhouse";
    case "semiDetached":
      return "semi-detached";
    default:
      return "detached";
  }
};

const getTodayFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

const formatWuYaoData = (data: WuyaoReqDataType) => {
  return {
    postcode: data.postalCode,
    streetAddress: data.adAddress,
    unit: data.adUnit || "",
    intersection: `${data.intersection1}/${data.intersection2}`,
    buildingType: parseUnitType(data.unitType),
    // rentalType
    bedroomTotal: data.bedrooms,
    rentalType: data.rentalType,
    livingRoomTotal: data.livingRooms,
    latitude: data.latitude,
    longitude: data.longitude,
    listingPhotos: data.listingPhotos,
    denTotal: 0,
    parkingTotal: data.features.includes("ParkingAvailable") ? 1 : 0,
    price: data.rent,
    includesWater: data.features.includes("UtilitiesIncluded"),
    includesHydro: data.features.includes("UtilitiesIncluded"),
    includesInternet: data.features.includes("InternetIncluded"),
    availableAt: data.moveinDate.asap
      ? getTodayFormattedDate()
      : data.moveinDate.date,
    leaseTerm: data.leaseTerm,
    description: data.htmlDescription,
    areaUsable: data.area,
    floor: data.floor,
    independentKitchen: data.features.includes("PrivateKitchen"),
    independentBathroom: data.features.includes("PrivateBathroom"),
    hasBasicFurniture: data.features.includes("Furnished"),
    includesCable: false,
    hasLaundry: data.features.includes("LaundryRoom"),
    hasSwimmingPool: data.features.includes("SwimmingPool"),
    hasAc: true,
    hasGym: data.features.includes("Gym"),
    hasBalcony: data.hasBalcony,
    targetStudent: data.features.includes("Student"),
    targetSingleFemale: data.features.includes("SingleFemale"),
    targetSingleMale: data.features.includes("SingleMale"),
    targetYoungCouple: true,
    targetFamily: true,
    nonSmoker: data.features.includes("NoSmoking"),
    noPet: data.features.includes("NoPetsAllowed"),
    infrequentCooking: !data.features.includes("CookingAllowed"),
    contactName: data.contact,
    contactNumberPrimary: data.phone,
    phoneVerifiedCode: "",
    contactNumberBackup: "",
    contactEmail: data.email || "",
    contactWechat: "",
    wechatQrcode: "",
  };
};

// export const create51Rental = async (page: Page) => {
//   await page.goto("https://house.51.ca/rental/publish/create");

//   await page.type("#postcode", houseData.postalCode);
//   await page.type('input[name="streetAddress"]', houseData.address.main);
//   if (houseData.address.unit) {
//     await page.type("#unit", houseData.address.unit);
//   }

//   await page.type('input[name="part1"]', houseData.intersection[0]);
//   await page.type('input[name="part2"]', houseData.intersection[1]);

// await page.select("#bedroomTotal", houseData.rooms.toString());
// await page.select("#livingRoomTotal", houseData.livingRooms.toString());
// await page.select("#parkingTotal", houseData.parking.toString());

//   await page.type("#price", houseData.price.toString());
//   await page.type("#leaseTerm", houseData.leaseTerm.toString());

//   await page.type("#description", houseData.description);
//   await page.type("#floor", houseData.floor.toString());

//   await page.evaluate((houseData) => {
//     const houseType = document.querySelector(
//       `input[value="${houseData.type.toLowerCase()}"]`
//     ) as HTMLInputElement;
//     houseType.checked = true;

//     const rentalType = document.querySelector(
//       `input[value="${houseData.rentalType.toLowerCase()}"]`
//     ) as HTMLInputElement;
//     rentalType.checked = true;

//     const avaliableNow = document.querySelector(
//       `input[label="立即入住"]`
//     ) as HTMLInputElement;
//     avaliableNow.checked = true;
//   }, houseData);
// };

export const create51Rental = async (page: Page, data: WuyaoReqDataType) => {
  await page.goto("https://house.51.ca/rental/publish/create");

  // await page.type("#postcode", data.postalCode);
  // await page.type('input[name="streetAddress"]', data.adAddress);

  // if (data.adUnit) {
  //   await page.type("#unit", data.adUnit);
  // }

  // await page.type('input[name="part1"]', data.intersection1);
  // await page.type('input[name="part2"]', data.intersection2);

  // await page.select("#bedroomTotal", data.bedrooms.toString());
  // // await page.select("#livingRoomTotal", data.);
  // if (data.features.includes("ParkingAvailable")) {
  //   await page.select("#parkingTotal", "1");
  // }

  // await page.type("#price", data.rent.toString());

  // const allCheckboxes = await page.$$(".el51__checkbox");
  // const allCheckboxBtns = await page.$$(".el51__checkbox-btn");

  // if (data.features.includes("UtilitiesIncluded")) {
  //   await allCheckboxes[0].click();
  //   await allCheckboxes[1].click();
  // }

  // if (data.features.includes("InternetIncluded")) {
  //   await allCheckboxes[2].click();
  // }

  // if (data.moveinDate.asap) {
  //   await allCheckboxBtns[12].click();
  // }

  // await allCheckboxBtns[13].click();

  // await clickUnitType(allCheckboxBtns, data.unitType);

  await page.click(".el51__dropdown.LocationSelect_locationSelect__MaZH-");
  const cityElements = await page.$$(".LocationSelect_item__4g0R6");

  for (const cityElement of cityElements) {
    const cityText = await page.evaluate(
      (element) => element.textContent,
      cityElement
    );
    if (cityText && cityText.includes(data.adCity)) {
      await cityElement.click();
      console.log(`Selected city: ${cityText}`);
      break;
    }
  }
};

export const create51RentalApi = async (
  page: Page,
  data?: WuyaoReqDataType
) => {
  if (data) {
    await page.goto("https://house.51.ca/rental/publish/create");

    await page.waitForNetworkIdle();

    const formattedData = formatWuYaoData(data);

    await fetchCookiesAndMakeApiCall(
      page,
      "https://house.51.ca/api/rental/listings?origin=web",
      "POST"
    );
  }
};

export const loginTo51API = async () => {
  const loginPage = await axios.get("https://account.51.ca/login");
  const loginHtml = cheerio.load(loginPage.data);

  const hiddenToken = loginHtml('input[name="_token"]');
  const token = hiddenToken.attr("value");

  const loginRes = await axios.post("https://account.51.ca/login", {
    _token: token,
    username: username,
    password: pass,
    remember: "on",
  });

  const setCookieHeaders = loginRes.headers["set-cookie"];

  // If there are multiple Set-Cookie headers, they may be in an array
  // In that case, you can access each one by iterating over setCookieHeaders

  if (setCookieHeaders) {
    // Now you can process the Set-Cookie headers
    for (const setCookieHeader of setCookieHeaders) {
      // You may want to parse or process the cookies further
      console.log("Set-Cookie Header:", setCookieHeader);
    }
  } else {
    console.log("No Set-Cookie headers found in the response.");
  }
};
