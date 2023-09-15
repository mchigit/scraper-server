import express from "express";
import adsRouter from "./routes/ads";
import xiaohongshuRouter from "./routes/xiaohongshu";
import cors from "cors";
import { PuppeteerBrowser } from "./utils/chrome";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ads", adsRouter);

app.use("/xiaohongshu", xiaohongshuRouter);

const server = app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  // Run your async method here
  await PuppeteerBrowser.close();

  server.close(() => {
    console.log("Server shut down");
    process.exit(0);
  });
});
