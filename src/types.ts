import { WorkspaceUploadResponse } from "./utils/imageUtils";

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

export type YorkbbsReqDataType = {
  adAddress: string;
  adTitle: string;
  bathRomms: number;
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
};
