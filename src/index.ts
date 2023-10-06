import "dotenv/config";

import express from "express";
import adsRouter from "./routes/ads";
import xiaohongshuRouter from "./routes/xiaohongshu";
import goodlifeRouter from "./routes/goodlife";
import cors from "cors";
import { generateDescription } from "./openAi";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/rental-description", async (req, res) => {
  try {
    const data = req.body;
    const generatedDescription = await generateDescription(data);

    if (generatedDescription) {
      return res.json({
        description: JSON.parse(generatedDescription),
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/test", async (req, res) => {
  const data = req.body;
  const generatedDescription = await generateDescription(data);

  if (generatedDescription) {
    return res.json({
      description: JSON.parse(generatedDescription),
    });
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
