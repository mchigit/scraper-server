import { PDFDocument } from "pdf-lib";
import { LeaseAgreementDataType, LeaseAgreementTermType } from "../types";

const getTodayFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
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

  form.getRadioGroup("Smoking Rulet Y/N").select("Choice1");

  if (data.tenantInsuranceNeeded) {
    form.getRadioGroup("Insurance Required Y/N").select("Choice2");
  } else {
    form.getRadioGroup("Insurance Required Y/N").select("Choice1");
  }

  if (data.additionalTerms) {
    form.getRadioGroup("Additional Terms Y/N").select("Choice2");
  } else {
    form.getRadioGroup("Additional Terms Y/N").select("Choice1");
  }

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};
