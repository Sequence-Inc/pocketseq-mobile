import { CancelPolicy, CANCEL_POLICY } from "./cancelPolicy";
import { PHOTO, Photo } from "./photo";
import { OPTION, Option } from "./option";
import { SUBSCRIPTION, Subscription } from "./subscription";
import { HotelRoom, HOTEL_ROOM } from "./hotelRoom";

export interface HotelPriceScheme {
  id: string;
  name: string;
  roomCharge: number;
  oneAdultCharge: number;
  twoAdultCharge: number;
  threeAdultCharge: number;
  fourAdultCharge: number;
  fiveAdultCharge: number;
  sixAdultCharge: number;
  sevenAdultCharge: number;
  eightAdultCharge: number;
  nineAdultCharge: number;
  tenAdultCharge: number;
  oneChildCharge: number;
  twoChildCharge: number;
  threeChildCharge: number;
  fourChildCharge: number;
  fiveChildCharge: number;
  sixChildCharge: number;
  sevenChildCharge: number;
  eightChildCharge: number;
  nineChildCharge: number;
  tenChildCharge: number;
  hotelId: string;
  createdAt: number;
  updatedAt: number;
}

export const HOTEL_PRICE_SCHEME = `
  id
  name
  roomCharge
  oneAdultCharge
  twoAdultCharge
  threeAdultCharge
  fourAdultCharge
  fiveAdultCharge
  sixAdultCharge
  sevenAdultCharge
  eightAdultCharge
  nineAdultCharge
  tenAdultCharge
  oneChildCharge
  twoChildCharge
  threeChildCharge
  fourChildCharge
  fiveChildCharge
  sixChildCharge
  sevenChildCharge
  eightChildCharge
  nineChildCharge
  tenChildCharge
  hotelId
  createdAt
  updatedAt
`;

export interface HotelPriceSetting {
  id: string;
  dayOfWeek: number;
  priceScheme: HotelPriceScheme;
  hotelRoomId: string;
  hotelRoom_packagePlan_id: string;
  createdAt: number;
  updatedAt: number;
}

export const HOTEL_PRICE_SETTING = `
  id
  dayOfWeek
  priceScheme {
    ${HOTEL_PRICE_SCHEME}
  }
  hotelRoomId
  hotelRoom_packagePlan_id
  createdAt
  updatedAt
`;

export interface HotelPackagePlanRoomType {
  id: string;
  hotelRoom: HotelRoom;
  priceSettings: HotelPriceSetting[];
  createdAt: number;
  updatedAt: number;
}

export const HOTEL_PACKAGE_PLAN_ROOM_TYPE = `
  id
  hotelRoom {
    ${HOTEL_ROOM}
  }
  priceSettings {
    ${HOTEL_PRICE_SETTING}
  }
  createdAt
  updatedAt
`;

export type PaymentTerm = "PER_PERSON" | "PER_ROOM";

export interface HotelPlan {
  id: number;
  name: string;
  description: string;
  paymentTerm: PaymentTerm;
  stock: number;
  startUsage: number;
  endUsage: number;
  startReservation: number;
  endReservation: number;
  cutOffBeforeDays: number;
  cutOffTillTime: number;
  isBreakfastIncluded: boolean;
  subcriptionPrice: number;
  hotelId: string;
  cancelPolicy: CancelPolicy;
  additionalOptions: Option[];
  includedOptions: Option[];
  photos: Photo[];
  roomTypes: HotelPackagePlanRoomType[];
  subscriptionProducts: Subscription[];
  createdAt: number;
  updatedAt: number;
}

export const HOTEL_PLAN = `
  id
  name
  description
  paymentTerm
  stock
  startUsage
  endUsage
  startReservation
  endReservation
  cutOffBeforeDays
  cutOffTillTime
  isBreakfastIncluded
  subcriptionPrice
  hotelId
  cancelPolicy {
    ${CANCEL_POLICY}
  }
  additionalOptions {
    ${OPTION}
  }
  includedOptions {
    ${OPTION}
  }
  photos {
    ${PHOTO}
  }
  roomTypes {
    ${HOTEL_PACKAGE_PLAN_ROOM_TYPE}
  }
  createdAt
  updatedAt
`;

// subscriptionProducts {
//   ${SUBSCRIPTION}
// }
