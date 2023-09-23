import { Router } from "express";
import { PuppeteerBrowser } from "../utils/chrome";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = await PuppeteerBrowser.getNewPage();

    if (!page) throw new Error("Failed to get new page");

    await page.goto("https://www.xiaohongshu.com/");
    await page.waitForSelector(".login-container");

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

export default router;
