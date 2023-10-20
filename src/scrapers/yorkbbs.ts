import { ElementHandle, Page } from "puppeteer-core";
import { YorkbbsFeaturesMap } from "../constants";
import { WorkspaceUploadResponse, YorkbbsReqDataType } from "../types";

// const username = "xiaoki";
// const pass = "wuhui@8866";

const username = "wuhui8013";
const pass = "google@88";

export const loginToYorkbbs = async (page: Page) => {
  await page.goto("https://account.yorkbbs.ca/login");

  const cookies = await page.cookies();
  if (cookies.length > 0) {
    const tokenCookie = cookies.find((cookie) => cookie.name === "token");
    if (tokenCookie) {
      // Already logged in
      return;
    }
  }

  await page.type('input[placeholder="用户名/ Email"]', username);
  await page.type('input[placeholder="密码"]', pass);

  await page.keyboard.press("Enter");

  await page.waitForSelector(".image-fit.header-user__avatar");
  // await page.waitForNavigation();
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
    await addressInput?.type(
      `${body.adUnit} - ${body.adAddress}, ${body.adCity} `
    );
  } else {
    await addressInput?.type(`${body.adAddress}, ${body.adCity}`);
  }

  await page.waitForTimeout(3000);
  while (true) {
    const suggestions = await page.$$(".el-autocomplete-suggestion__list li");
    if (suggestions.length > 0) {
      await suggestions[0].click();
      break;
    }

    await page.waitForTimeout(1000);
  }

  const contactInput = await page.$('input[placeholder="联系人名称"]');
  if (contactInput) {
    const currentValue = await page.evaluate((x) => x.value, contactInput);

    // if (currentValue.length > 0) {
    //   await contactInput.click();
    //   for (let i = 0; i < currentValue.length; i++) {
    //     await page.keyboard.press("Backspace");
    //   }
    // }

    if (currentValue.length === 0) {
      await page.type('input[placeholder="联系人名称"]', body.contact);
    }
  }

  const phoneInput = await page.$(
    'input[placeholder="请输入10位电话号码，如 000 000 0000"]'
  );
  if (phoneInput) {
    const currentValue = await page.evaluate(
      (x) => x.value,
      phoneInput as ElementHandle<HTMLInputElement>
    );

    // if (currentValue.length > 0) {
    //   await phoneInput.click();
    //   for (let i = 0; i < currentValue.length; i++) {
    //     await page.keyboard.press("Backspace");
    //   }
    // }

    if (currentValue.length === 0) {
      await page.type(
        'input[placeholder="请输入10位电话号码，如 000 000 0000"]',
        body.phone
      );
    }
  }

  await page.evaluate((description) => {
    const descriptionInput = document.querySelector<HTMLParagraphElement>(
      ".editor-txt-content p"
    );
    if (descriptionInput) {
      descriptionInput.innerHTML = description;
    }
  }, body.description);

  const allCheckboxes = await page.$$(".el-checkbox__inner");
  const features = body.features;
  if (features.length > 0) {
    await Promise.all(
      features.map(async (feature) => {
        await allCheckboxes[
          // Hack to skip first 2 checkboxes
          YorkbbsFeaturesMap[feature as keyof typeof YorkbbsFeaturesMap] + 2
        ].click();
      })
    );
  }

  if (body.moveinDate.asap) {
    const checkboxes = await page.$$(".el-checkbox");
    if (checkboxes.length > 2) {
      await checkboxes[1].click();
    }
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
  textToLookFor.push(getBathroomString(body.bathRooms));

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
  }, body.htmlDescription);

  const imageUploadHandle = await page.$('input[type="file"].img-file');

  if (imageUploadHandle) {
    await Promise.all(
      body.images.map(async (image) => {
        await imageUploadHandle.uploadFile(image.path);
      })
    );

    await page.waitForNetworkIdle();
  }
};
