import { Router, Request, Response } from "express";

import { create51Rental, loginTo51 } from "../scrapers/wuyao";
import {
  createYorkBbsRental,
  createYorkbbsForumPost,
  loginToYorkbbs,
} from "../scrapers/yorkbbs";
import { YorkbbsReqDataType } from "../types";
import { PuppeteerBrowser } from "../utils/chrome";

const router = Router();

router.post("/wuyao", async (req: Request, res: Response) => {
  try {
    const page = await PuppeteerBrowser.getNewPage();

    await loginTo51(page);

    await create51Rental(page);

    const response = await page.screenshot({ fullPage: true });

    res.writeHead(200, {
      "Content-Type": "image/png", // or 'image/jpg', 'image/gif', etc.
      "Content-Length": response.length,
    });
    res.end(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post(
  "/yorkbbs",
  async (req: Request<any, any, YorkbbsReqDataType>, res: Response) => {
    try {
      const body = req.body;
      if (!body) {
        return res.status(400).json({
          message: "Invalid request body",
        });
      }

      const page = await PuppeteerBrowser.getNewPage();

      const images = body.images;

      //   const imageResults = await uploadImageBlobs(images);
      //   await uploadImage

      await loginToYorkbbs(page);
      await createYorkBbsRental(page, body, images);

      await page.click("button.form-button__submit");

      await page.waitForNavigation();

      const response = await page.screenshot({ fullPage: true });

      res.writeHead(200, {
        "Content-Type": "image/png", // or 'image/jpg', 'image/gif', etc.
        "Content-Length": response.length,
      });
      res.end(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

router.post(
  "/yorkbbs/forum",
  async (req: Request<any, any, YorkbbsReqDataType>, res: Response) => {
    try {
      //   const body = req.body;
      //   if (!body) {
      //     return res.status(400).json({
      //       message: "Invalid request body",
      //     });
      //   }

      const page = await PuppeteerBrowser.getNewPage();

      await loginToYorkbbs(page);
      await page.goto("https://forum.yorkbbs.ca/publish/houserental");

      await createYorkbbsForumPost(page, req.body);
      //   const images = body.images;

      //   const imageResults = await uploadImageBlobs(images);
      //   await uploadImage

      // await loginToYorkbbs(page);
      // await createYorkbbsRental(page, body, images);

      //   await page.click("button.form-button__submit");

      //   await page.waitForNavigation();

      const response = await page.screenshot({ fullPage: true });

      res.writeHead(200, {
        "Content-Type": "image/png", // or 'image/jpg', 'image/gif', etc.
        "Content-Length": response.length,
      });
      res.end(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
