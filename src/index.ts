import "dotenv/config";

import express, { Request, Response } from "express";
import adsRouter from "./routes/ads";
import xiaohongshuRouter from "./routes/xiaohongshu";
import goodlifeRouter from "./routes/goodlife";
import cors from "cors";
import { generateDescription } from "./openAi";
import { PuppeteerBrowser } from "./utils/chrome";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { LeaseAgreementDataType } from "./types";
import { fillForm } from "./utils/fillPdfForm";
import { signClause } from "./utils/additionalTermsUtil";

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
  const termsSignPDF = await PDFDocument.create();
  const timesRomanFont = await termsSignPDF.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await termsSignPDF.embedFont(
    StandardFonts.TimesRomanBold
  );

  const signPage = termsSignPDF.addPage([550, 750]);
  const form = termsSignPDF.getForm();

  const fontSize = 16;
  signPage.drawText("Tenant(s):", {
    x: 50,
    y: 700,
    size: fontSize,
    font: timesRomanBold,
  });

  const superheroField = form.createTextField("tenant.name");
  superheroField.setText("");
  superheroField.addToPage(signPage, { x: 50, y: 650 });

  const pdfBytes = await termsSignPDF.save();

  res.setHeader("Content-Disposition", `attachment; filename="agreement.pdf"`);
  res.setHeader("Content-Type", "application/pdf");

  // const pdfBuffer = Buffer.from(pdfBytes, "base64");
  res.end(pdfBytes);
});

app.get("/scrape-data", async (req, res) => {
  try {
    const page = await PuppeteerBrowser.getNewPage();

    if (!page) throw new Error("Failed to get new page");

    await page.goto("https://cbaapps.org/ClassAction/Search.aspx");
    await page.waitForSelector("#BtnSearch");

    await page.click("#BtnSearch");

    await page.waitForNetworkIdle();

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

app.use("/ads", adsRouter);

app.use("/xiaohongshu", xiaohongshuRouter);

app.use(goodlifeRouter);

app.post(
  "/leaseAgreement",
  async (req: Request<any, any, LeaseAgreementDataType>, res: Response) => {
    const filePath =
      process.env.NODE_ENV === "development"
        ? path.join(__dirname, "../OntarioLeaseAgreement.pdf")
        : "/app/OntarioLeaseAgreement.pdf";
    const fileContents = fs.readFileSync(filePath);
    const buffer = Buffer.from(fileContents);
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const pdfs = await fillForm(req.body, pdfDoc);

    const mergedPdf = await PDFDocument.create();

    const copiedPagesA = await mergedPdf.copyPages(
      pdfs.pdfDoc,
      pdfs.pdfDoc.getPageIndices()
    );
    copiedPagesA.forEach((page) => mergedPdf.addPage(page));

    if (pdfs.termsPdf) {
      const copiedPagesB = await mergedPdf.copyPages(
        pdfs.termsPdf,
        pdfs.termsPdf.getPageIndices()
      );
      copiedPagesB.forEach((page) => mergedPdf.addPage(page));
    }

    if (pdfs.termsSignPDF) {
      const copiedPagesC = await mergedPdf.copyPages(
        pdfs.termsSignPDF,
        pdfs.termsSignPDF.getPageIndices()
      );
      copiedPagesC.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfFile = await mergedPdf.save();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="agreement.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    res.end(mergedPdfFile);
  }
);

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});
