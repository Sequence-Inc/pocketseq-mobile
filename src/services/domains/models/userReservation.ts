import { HotelPlan, HOTEL_PLAN } from "./hotelPlan";
import { HotelRoom, HOTEL_ROOM } from "./hotelRoom";
import { SpaceExcerpt, SPACE_EXCERPT } from "./space";
import { TRANSACTION, Transaction } from "./transaction";

export type ReservationStatus = "RESERVED" | "HOLD" | "PENDING" | "FAILED" | "DISAPPROVED" | "CANCELED" | undefined;

export type SortOrder = "asc" | "desc";

export interface HotelReservationFilter {
  sortOrder: SortOrder;
  status?: ReservationStatus;
}

export interface SpaceReservationFilter {
  sortOrder: SortOrder;
  status?: ReservationStatus;
}

export interface UserReservationHotel {
  id: string;
  reservationId: string;
  fromDateTime: number;
  toDateTime: number;
  status: ReservationStatus;
  createdAt: number;
  updatedAt: number;
  approved: boolean;
  approvedOn: number;
  hotelRoom: HotelRoom;
  packagePlan: HotelPlan;
  transaction: Transaction;
}

export interface UserReservationSpace {
  id: string;
  reservationId: string;
  fromDateTime: number;
  toDateTime: number;
  status: ReservationStatus;
  createdAt: number;
  updatedAt: number;
  approved: Boolean;
  approvedOn: number;
  space: SpaceExcerpt;
  transaction: Transaction;
}

export const USER_RESERVATION_SPACE = `
  id
  reservationId
  fromDateTime
  toDateTime
  status
  createdAt
  updatedAt
  approved
  approvedOn
  space {
    ${SPACE_EXCERPT}
  }
  transaction {
    ${TRANSACTION}
  }
`;

export const USER_RESERVATION_HOTEL = `
  id
  reservationId
  fromDateTime
  toDateTime
  status
  createdAt
  updatedAt
  approved
  approvedOn
  hotelRoom {
    ${HOTEL_ROOM}
  }
  packagePlan {
    ${HOTEL_PLAN}
  }
  transaction {
    ${TRANSACTION}
  }
`;
