import { ADDRESS, Address } from "./address";
import { Host, HOST } from "./host";
import { HotelPlan, HOTEL_PLAN } from "./hotelPlan";
import { HotelRoom, HOTEL_ROOM } from "./hotelRoom";
import { PHOTO, Photo } from "./photo";
import { HotelNearestStation, HOTEL_NEAREST_STATION } from "./station";

export type HotelBuildingType = "WHOLE_HOUSE" | "SIMPLE_ACCOMODATION" | "HOTEL" | "INN";

export const hotelBuildingTypes = {
  WHOLE_HOUSE: "一棟貸し",
  SIMPLE_ACCOMODATION: "簡易宿泊",
  HOTEL: "ホテル",
  INN: "旅館",
};
export const hotelBuildingTypeArray = [
  { type: "WHOLE_HOUSE", name: "一棟貸し" },
  { type: "SIMPLE_ACCOMODATION", name: "簡易宿泊" },
  { type: "HOTEL", name: "ホテル" },
  { type: "INN", name: "旅館" },
];

export interface Hotel {
  id: string;
  name: string;
  description: string;
  checkInTime: number;
  checkOutTime: number;
  status: "DRAFTED" | "PUBLISHED" | "HIDDEN" | "DELETED";
  buildingType: HotelBuildingType;
  isPetAllowed: boolean;
  address: Address;
  nearestStations: HotelNearestStation[];
  photos: Photo[];
  rooms: HotelRoom[];
  host: Host;
  packagePlans: HotelPlan[];
  createdAt: number;
  updatedAt: number;
}

export const HOTEL = `
  id
  name
  description
  checkInTime
  checkOutTime
  status
  buildingType
  isPetAllowed
  host {
    ${HOST}
  }
  address {
    ${ADDRESS}
  }
  nearestStations {
    ${HOTEL_NEAREST_STATION}
  }
  photos {
    ${PHOTO}
  }
  rooms {
    ${HOTEL_ROOM}
  }
  packagePlans {
    ${HOTEL_PLAN}
  }
  createdAt
  updatedAt
`;
