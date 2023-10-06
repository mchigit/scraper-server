import { Router, Request, Response } from "express";
import { PuppeteerBrowser } from "../utils/chrome";

const router = Router();

export function subtractOneMonth(dateString: string): string {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Subtract one month from the date
  date.setMonth(date.getMonth() - 1);

  // Format the date as "MM/DD/YYYY"
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;

  // Return the formatted date string
  return formattedDate;
}

router.post("/goodlife/receipt", async (req: Request, res: Response) => {
  try {
    const formFields = req.body;
    if (!formFields) {
      return res.status(400).send("Missing form fields");
    }

    console.log("Automating Goodlife receipt...");
    const page = await PuppeteerBrowser.getNewPage();
    if (!page) throw new Error("Failed to get new page");
    await page.goto("https://receipts.goodlifefitness.com/");

    await page.waitForSelector("#Copy_first_name");

    await page.type("#Copy_first_name", formFields.firstName);
    await page.type("#Copy_last_name", formFields.lastName);
    await page.type("#Copy_revcan_number", formFields.barCode);
    await page.type("#Copy_street", formFields.street);
    await page.type("#Copy_city", formFields.city);
    await page.type("#Copy_postal_code", formFields.postalCode);
    await page.type("#Copy_email", formFields.email);
    await page.type("#Copy_email2", formFields.email);
    await page.type("#Copy_telephone", formFields.phone);

    await page.select("#Copy_drpBirthMonth", formFields.birthMonth);
    await page.select("#Copy_drpBirthDay", formFields.birthDay);
    await page.select("#Copy_drpBirthYear", formFields.birthYear);
    await page.select("#Copy_province", formFields.province);

    await page.click("#Copy_enddate");
    await page.keyboard.press("Enter");

    const inputValue = await page.$eval(
      `#Copy_enddate`,
      (input) => (input as HTMLInputElement).value
    );

    const startDate = subtractOneMonth(inputValue);
    await page.type("#Copy_startdate", startDate);

    await page.click("#Copy_CheckBox1");

    await page.click("#Copy_btnSubmit3day");

    await page.waitForNavigation();

    const imageBuffer = await page.screenshot({
      fullPage: true,
    });

    res.writeHead(200, {
      "Content-Type": "image/png", // or 'image/jpg', 'image/gif', etc.
      "Content-Length": imageBuffer.length,
    });
    return res.end(imageBuffer);
  } catch (error) {
    console.error("Error in /goodlife/receipt", error);
    res.status(500);
    res.end();
    return;
  }
});

export default router;
