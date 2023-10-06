import "dotenv/config";

import express from "express";
import adsRouter from "./routes/ads";
import xiaohongshuRouter from "./routes/xiaohongshu";
import goodlifeRouter from "./routes/goodlife";
import cors from "cors";
import { PuppeteerBrowser } from "./utils/chrome";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", async (req, res) => {
  const page = await PuppeteerBrowser.getNewPage();

  if (page) {
    await page.goto("https://www.xiaohongshu.com/");

    const response = await page.screenshot({ fullPage: true });

    res.writeHead(200, {
      "Content-Type": "image/png", // or 'image/jpg', 'image/gif', etc.
      "Content-Length": response.length,
    });
    res.end(response);

    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
});

app.use("/ads", adsRouter);

app.use("/xiaohongshu", xiaohongshuRouter);

app.use(goodlifeRouter);

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});
