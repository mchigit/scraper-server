import { PDFDocument, PDFForm } from "pdf-lib";
import { LeaseAgreementDataType, LeaseAgreementTermType } from "../types";
import { generateAdditionalTerms } from "./additionalTermsUtil";
import { PuppeteerBrowser } from "./chrome";
import path from "path";
import fs from "fs";

const getTodayFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

const fillLandlordTenantInfo = (
  data: LeaseAgreementDataType,
  form: PDFForm
) => {
  const maxLandlord = data.landlords.slice(0, 2);
  maxLandlord.forEach((landlordName, index) => {
    form.getTextField(`Landlord ${index + 1} Name`).setText(landlordName);
    if (index === 0) {
      form
        .getTextField(`Landlord ${index + 1} Name For Signature`)
        .setText(landlordName);
    } else {
      form
        .getTextField(`Landlord ${index + 1} Name for Signature`)
        .setText(landlordName);
    }

    form
      .getTextField(`Signature Date LL${index + 1}`)
      .setText(getTodayFormattedDate());
  });

  const maxTenant = data.tenants.slice(0, 5);
  maxTenant.forEach((tenantName, index) => {
    form.getTextField(`Tenant ${index + 1} Last`).setText(tenantName.lastName);
    form
      .getTextField(`Tenant ${index + 1} First`)
      .setText(tenantName.firstName);

    const fullName = `${tenantName.firstName} ${tenantName.lastName}`;
    form
      .getTextField(`Tenant ${index + 1} Name for Signature`)
      .setText(fullName);

    form
      .getTextField(`Signature ${index + 1} Date`)
      .setText(getTodayFormattedDate());
  });
};

const fillRentalPropertyInfo = (
  data: LeaseAgreementDataType,
  form: PDFForm
) => {
  if (data.isCondo) {
    form.getRadioGroup("Condo Yes").select("Choice1");
  } else {
    form.getRadioGroup("Condo Yes").select("Choice2");
  }

  if (data.unit) {
    form.getTextField("Unit #").setText(data.unit);
  }

  form.getTextField("Street Number").setText(data.streetNumber);
  form.getTextField("Street Name").setText(data.streetName);
  form.getTextField("City").setText(data.city);
  form.getTextField("Postal").setText(data.postalCode);

  if (data.parking) {
    form.getTextField("Number Vehicles").setText(data.parking);

    if (data.vehicleDescription) {
      form.getTextField("Vehicle Details").setText(data.vehicleDescription);
    }
  }
};

const fillContactInfo = (data: LeaseAgreementDataType, form: PDFForm) => {
  if (data.landLordAddress) {
    if (data.landLordAddress.unit) {
      form
        .getTextField("Landlord Address Unit")
        .setText(data.landLordAddress.unit);
    }

    form
      .getTextField("Landlord Address Street Number")
      .setText(data.landLordAddress.streetNumber);
    form
      .getTextField("Landlord Address Street Name")
      .setText(data.landLordAddress.streetName);
    form
      .getTextField("Landlord Address City")
      .setText(data.landLordAddress.city);
    form
      .getTextField("Landlord Address Postal")
      .setText(data.landLordAddress.postalCode);
    form
      .getTextField("Landlord Address Province")
      .setText(data.landLordAddress.province);
  }

  if (data.landlordEmail) {
    form.getTextField("Email Landlord").setText(data.landlordEmail);
  }

  if (data.tenantEmail) {
    form.getTextField("Email Tenant").setText(data.tenantEmail);
  }

  if (data.landlordPhone) {
    form.getTextField("Emerge Contact Phone").setText(data.landlordPhone);
  }
};

const fillTermAndRentInfo = (data: LeaseAgreementDataType, form: PDFForm) => {
  form.getTextField("Tenancy Start Date").setText(data.agreementStart);

  form.getRadioGroup("Term Type").select(data.termType);
  if (data.termType === LeaseAgreementTermType.Fixed && data.timeEnding) {
    form.getTextField("Term End Date").setText(data.timeEnding);
  }

  form.getTextField("Day of Month Rent Due").setText(data.rentDue);
  form.getTextField("Base Rent").setText(data.baseRent);

  if (data.parkingFee) {
    form.getTextField("Parking").setText(data.parkingFee);
    form
      .getTextField("Lawful Rent")
      .setText(
        (parseFloat(data.baseRent) + parseFloat(data.parkingFee)).toString()
      );
  } else {
    form.getTextField("Lawful Rent").setText(data.baseRent);
  }

  if (data.rentPayeeName) {
    form.getTextField("Rent Payee Name").setText(data.rentPayeeName);
  }

  if (data.rentMethod) {
    form.getTextField("Rent Payee Method").setText(data.rentMethod);
  } else {
    form.getTextField("Rent Payee Method").setText("Post-dated Cheques");
  }
};

const fillPartialMonthInfo = (data: LeaseAgreementDataType, form: PDFForm) => {
  if (data.partialMonth) {
    form.getTextField("Prorated Amount").setText(data.partialMonth.partialRent);
    form
      .getTextField("Prorated Payment Date")
      .setText(data.partialMonth.partialRentDate);
    form
      .getTextField("Prorated Date Start")
      .setText(data.partialMonth.coveredFrom);
    form.getTextField("Prorated Date End").setText(data.partialMonth.coveredTo);
  }
};

const fillDepositInfo = (data: LeaseAgreementDataType, form: PDFForm) => {
  if (data.rentDeposit) {
    form.getTextField("LMR Amount").setText(data.rentDeposit);
    form.getRadioGroup("LMR Deposit Y/N").select("Choice2");
  } else {
    form.getRadioGroup("LMR Deposit Y/N").select("Choice1");
  }

  if (data.keyDeposit) {
    form.getTextField("Key Deposit Amount").setText(data.keyDeposit);
    form.getRadioGroup("Key Deposit Y/N").select("Choice2");
  } else {
    form.getRadioGroup("Key Deposit Y/N").select("Choice1");
  }
};

const fillServicesAndUtil = (data: LeaseAgreementDataType, form: PDFForm) => {
  console.log(form.getRadioGroup("Gas YESNO").getOptions());

  form.getRadioGroup("Gas YESNO").select("Choice1");
  form.getRadioGroup("AC YESNO").select("Choice1");
  form.getRadioGroup("STORAGE YESNO").select("Choice2");

  form.getRadioGroup("Laundry YESNO").select("Choice1");
  form.getRadioGroup("Parking Provided YESNO").select("Choice2");

  if (data.utilityIncluded) {
    form.getRadioGroup("Electricity Responsibility L/T").select("Choice1");
    form.getRadioGroup("Heat Responsibility L/T").select("Choice1");
    form.getRadioGroup("Water Responsibility L/T").select("Choice1");
    form.getRadioGroup("Water Heater Responsibility L/T").select("Choice1");
  } else {
    form.getRadioGroup("Electricity Responsibility L/T").select("Choice2");
    form.getRadioGroup("Heat Responsibility L/T").select("Choice2");
    form.getRadioGroup("Water Responsibility L/T").select("Choice2");
    form.getRadioGroup("Water Heater Responsibility L/T").select("Choice2");
  }
};

export const fillForm = async (
  data: LeaseAgreementDataType,
  pdfDoc: PDFDocument
) => {
  const form = pdfDoc.getForm();
  const allFields = form.getFields();

  allFields.forEach((field) => {
    console.log(field.getName());
  });

  fillLandlordTenantInfo(data, form);
  fillRentalPropertyInfo(data, form);
  fillContactInfo(data, form);

  fillTermAndRentInfo(data, form);

  fillPartialMonthInfo(data, form);

  fillDepositInfo(data, form);

  fillServicesAndUtil(data, form);

  form.getRadioGroup("Smoking Rulet Y/N").select("Choice1");

  if (data.tenantInsuranceNeeded) {
    form.getRadioGroup("Insurance Required Y/N").select("Choice2");
  } else {
    form.getRadioGroup("Insurance Required Y/N").select("Choice1");
  }

  let termsPdf: PDFDocument | null = null;
  let termsSignPDF: PDFDocument | null = null;

  if (data.additionalTerms) {
    form.getRadioGroup("Additional Terms Y/N").select("Choice2");
    const termsHtml = generateAdditionalTerms(data.additionalTerms);

    const page = await PuppeteerBrowser.getNewPage();

    if (page) {
      page.setContent(termsHtml);
      await page.waitForSelector("body");
      const termsPage = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      termsPdf = await PDFDocument.load(termsPage);
      await PuppeteerBrowser.disconnect();

      const filePath =
        process.env.NODE_ENV === "development"
          ? path.join(__dirname, "../../additional-terms-sign.pdf")
          : "/app/additional-terms-sign.pdf";
      const fileContents = fs.readFileSync(filePath);
      const buffer = Buffer.from(fileContents);
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );

      termsSignPDF = await PDFDocument.load(arrayBuffer);
    }
    // const termsPage = await pdfDoc.embedPages()
  } else {
    form.getRadioGroup("Additional Terms Y/N").select("Choice1");
  }

  return {
    pdfDoc,
    termsPdf,
    termsSignPDF,
  };
};
