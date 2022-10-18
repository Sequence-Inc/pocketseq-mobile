import { PHOTO, Photo } from "./photo";

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  maxCapacityAdult: number;
  maxCapacityChild: number;
  stock: number;
  hotelId: string;
  photos: Photo[];
  createdAt: number;
  updatedAt: number;
}

export const HOTEL_ROOM = `
  id
  name
  description
  maxCapacityAdult
  maxCapacityChild
  stock
  hotelId
  photos {
    ${PHOTO}
  }
  createdAt
  updatedAt
`;
