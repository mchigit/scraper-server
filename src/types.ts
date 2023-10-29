export enum HouseType {
  Condo = "Condo",
  House = "House",
  Townhouse = "Townhouse",
  Basement = "Basement",
  Apartment = "Apartment",
  SemiDetached = "Semi-Detached",
  Detached = "Detached",
}

export type CommonHouseData = {
  address: {
    main: string;
    unit?: string;
  };
  postalCode: string;
  city: string;
  type: HouseType;
  price: number;
  description: string;
  title: string;
};

export enum wuyaoRentalType {
  room = "room",
  suite = "suite",
  floor = "floor",
  whole = "whole",
  parking = "parking",
  resort = "resort",
  storage = "storage",
}

export type WorkspaceUploadResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type YorkbbsReqDataType = {
  adAddress: string;
  adTitle: string;
  adCity: string;
  bathRooms: number;
  bedrooms: number;
  description: string;
  rent: number;
  unitType: string;
  area: number;
  features: string[];
  intersection1: string;
  intersection2: string;
  phone: string;
  contact: string;
  adUnit?: string;
  moveinDate: {
    asap: boolean;
    date: string;
  };
  images: WorkspaceUploadResponse[];
  htmlDescription: string;
};

export type WuyaoReqDataType = YorkbbsReqDataType & {
  postalCode: string;
  rentalType: string;
  livingRooms: number;
  floor: number;
  leaseTerm: number;
  latitude: string;
  longitude: string;
  listingPhotos: Array<{
    id: number;
    uri: string;
    uriThumbnail: string;
  }>;
  hasBalcony: boolean;
  email?: string;
};

export type KijijiReqDataType = {
  adTitle: string;
  rent: number;
  description: string;
  unitType: string;
};

export enum LeaseAgreementTermType {
  Fixed = "Choice1",
  Monthly = "Choice2",
  Others = "Choice3",
}

export enum RentDue {
  First = "First",
  Second = "Second",
  Last = "Last",
}

export type LeaseAgreementDataType = {
  landlords: string[];
  tenants: {
    firstName: string;
    lastName: string;
  }[];
  unit?: string;
  streetNumber: string;
  streetName: string;
  city: string;
  postalCode: string;
  parking?: string;
  vehicleDescription?: string;
  isCondo: boolean;
  landLordAddress?: {
    unit?: string;
    streetNumber: string;
    streetName: string;
    city: string;
    postalCode: string;
    province: string;
  };
  landlordEmail?: string;
  tenantEmail?: string;
  landlordPhone?: string;
  tenantPhone?: string;
  agreementStart: string;
  termType: LeaseAgreementTermType;
  timeEnding?: string;
  baseRent: string;
  parkingFee?: string;
  rentPayeeName?: string;
  rentMethod?: string;
  rentDue: RentDue;
  partialMonth?: {
    partialRent: string;
    partialRentDate: string;
    coveredFrom: string;
    coveredTo: string;
  };
  rentDeposit?: string;
  keyDeposit?: string;
  tenantInsuranceNeeded?: boolean;
  additionalTerms?: boolean;
  utilityIncluded: boolean;
  features?: string[];
};
