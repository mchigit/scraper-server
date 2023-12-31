import { HouseType, wuyaoRentalType } from "./types";

// export const CHROME_ENDPOINT =
//   process.env.NODE_ENV === "development"
//     ? "wss://chrome.browserless.io?token=bb5ca160-df49-4849-ba40-ebd49b9ad280"
//     : `ws://chrome:3000`;
export const CHROME_ENDPOINT =
  "wss://chrome.browserless.io?token=bb5ca160-df49-4849-ba40-ebd49b9ad280";

export const houseData = {
  postalCode: "L4J 7X1",
  address: {
    main: "7 Townsgate Dr",
    unit: undefined,
  },
  city: "Thornhill",
  intersection: ["Sheppard", "Birchmount"],
  type: HouseType.Apartment,
  rentalType: wuyaoRentalType.whole,
  rooms: 4,
  livingRooms: 1,
  parking: 1,
  price: 3000,
  area: 1000,
  leaseTerm: 6,
  floor: 20,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliq",
  yorkbbs: {
    type: "整租",
    houseType: "Condo",
    bedrooms: 3,
    bathrooms: 2,
  },
};

export enum YorkbbsFeaturesMap {
  Basement = 0,
  SeparateEntranceBasement = 1,
  PrivateKitchen = 2,
  PrivateBathroom = 3,
  Furnished = 4,
  LaundryRoom = 5,
  SwimmingPool = 6,
  Gym = 7,
  SingleFemale = 8,
  SingleMale = 9,
  Student = 10,
  NoPetsAllowed = 11,
  NoSmoking = 12,
  WithHomeAppliances = 13,
  AvailableForRent = 14,
  UtilitiesIncluded = 15,
  CookingAllowed = 16,
  InternetIncluded = 17,
  CloseToSupermarket = 18,
  NearSubwayStation = 19,
  ParkingAvailable = 20,
}
