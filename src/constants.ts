import { HouseType, wuyaoRentalType } from "./types";

export const CHROME_ENDPOINT = "ws://localhost:3001/?stealth";
export const CHROME_ENDPOINT_HTTPS = "http://localhost:3001";

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
