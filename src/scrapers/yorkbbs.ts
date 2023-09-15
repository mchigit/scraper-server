import { Page } from "puppeteer-core";
import { YorkbbsFeaturesMap, houseData } from "../constants";
import { YorkbbsReqDataType } from "../types";
import { WorkspaceUploadResponse } from "../utils/imageUtils";

const username = "wuhui8013";
const pass = "google@88";
const nickname = "M. Cai";
const phone = "647-136-8013";

export const loginToYorkbbs = async (page: Page) => {
  await page.goto("https://house.yorkbbs.ca/");

  const cookies = await page.cookies();
  if (cookies.length > 0) {
    const tokenCookie = cookies.find((cookie) => cookie.name === "token");
    if (tokenCookie) {
      // Already logged in
      return;
    }
  }

  await page.click(".el-button.el-button--danger.el-button--medium");

  await page.type('input[placeholder="用户名/ Email"]', username);
  await page.type('input[placeholder="密码"]', pass);

  await page.keyboard.press("Enter");

  await page.waitForSelector(".image-fit.header-user__avatar");
};

const getUnitTypeString = (unitType: string) => {
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

const getBedroomString = (bedrooms: number) => {
  if (bedrooms > 3) {
    return "4室以上";
  }

  return `${Math.ceil(bedrooms)}室`;
};

const getBathroomString = (bathrooms: number) => {
  if (bathrooms > 3) {
    return "4卫以上";
  }

  return `${Math.ceil(bathrooms)}卫`;
};

export const createYorkBbsRental = async (
  page: Page,
  body: YorkbbsReqDataType,
  images: WorkspaceUploadResponse[]
) => {
  await page.goto("https://house.yorkbbs.ca/publish/rent");

  await page.type('input[placeholder="$ 请输入数字"]', body.rent.toString());

  const intersectionInputs = await page.$$('input[placeholder="输入英文路名"]');
  await intersectionInputs[0].type(body.intersection1);
  await intersectionInputs[1].type(body.intersection2);

  const addressInput = await page.$('input[placeholder="请输入内容"]');
  if (body.adUnit) {
    await addressInput?.type(`${body.adUnit} - ${body.adAddress} `);
  } else {
    await addressInput?.type(body.adAddress);
  }

  await page.type('input[placeholder="联系人名称"]', body.contact);
  await page.type(
    'input[placeholder="请输入10位电话号码，如 000 000 0000"]',
    body.phone
  );

  await page.evaluate((houseData) => {
    const descriptionInput = document.querySelector<HTMLParagraphElement>(
      ".editor-txt-content p"
    );
    if (descriptionInput) {
      descriptionInput.innerHTML = houseData.description;
    }
  }, houseData);

  const allCheckboxes = await page.$$(".el-checkbox__inner");
  const features = body.features;
  if (features.length > 0) {
    await Promise.all(
      features.map(async (feature) => {
        console.log(
          YorkbbsFeaturesMap[feature as keyof typeof YorkbbsFeaturesMap] + 2
        );
        await allCheckboxes[
          // Hack to skip first 2 checkboxes
          YorkbbsFeaturesMap[feature as keyof typeof YorkbbsFeaturesMap] + 2
        ].click();
      })
    );
  }

  if (body.moveinDate.asap) {
    await allCheckboxes[1].click();
  } else {
    await page.type(
      'input[placeholder="请选择入住时间"]',
      body.moveinDate.date
    );
  }

  const textToLookFor: string[] = [];

  textToLookFor.push(getUnitTypeString(body.unitType));
  textToLookFor.push("整租");
  textToLookFor.push(getBedroomString(body.bedrooms));
  textToLookFor.push(getBathroomString(body.bathRomms));

  await page.evaluate((textToLookFor) => {
    const allRadios = document.querySelectorAll<HTMLLabelElement>(
      'label[role="radio"]'
    );

    allRadios.forEach((radio) => {
      if (textToLookFor.includes(radio.innerText)) {
        radio.click();
      }
    });
  }, textToLookFor);

  const imageUploadHandle = await page.$('input[type="file"]');

  if (imageUploadHandle) {
    await Promise.all(
      images.map(async (image) => {
        await imageUploadHandle.uploadFile(image.path);
      })
    );
    // await imageUploadHandle.uploadFile("/images/1.jpeg");
    // await imageUploadHandle.uploadFile("/images/2.jpeg");

    await page.waitForNetworkIdle();
  }
};

export const createYorkbbsForumPost = async (
  page: Page,
  body: YorkbbsReqDataType
) => {
  await page.waitForSelector('textarea[placeholder="请输入帖子标题"]');

  await page.type('textarea[placeholder="请输入帖子标题"]', body.adTitle);

  await page.evaluate((description) => {
    const descriptionInput = document.querySelector(".editor-txt-content");
    if (descriptionInput) {
      const descriptionHtml = document.createElement("p");
      descriptionHtml.innerHTML = description;
      descriptionInput.prepend(descriptionHtml);
    }
  }, body.description);

  const imageUploadHandle = await page.$('input[type="file"].img-file');

  if (imageUploadHandle) {
    await Promise.all(
      body.images.map(async (image) => {
        await imageUploadHandle.uploadFile(image.path);
      })
    );
    // await imageUploadHandle.uploadFile("/images/1.jpeg");
    // await imageUploadHandle.uploadFile("/images/2.jpeg");

    await page.waitForNetworkIdle();
  }

  const footerBtns = await page.$$(".editor-footer__right button");

  if (footerBtns.length === 2) {
    await footerBtns[1].click();
  }
};
