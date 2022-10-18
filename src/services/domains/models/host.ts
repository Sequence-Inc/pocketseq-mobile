import { PHOTO, Photo } from "./photo";

export interface Host {
  id: string;
  type: "Individual" | "Corporate";
  name: string;
  approved: boolean;
  photoId: Photo;
  profilePhoto: Photo;
  accountId: string;
  rating: number;
  createdAt: number;
  updatedAt: number;
}

export const HOST = `
  id:
  type
  name
  approved
  photoId {
    ${PHOTO}
  }
  profilePhoto {
    ${PHOTO}
  }
  accountId
  rating
  createdAt
  updatedAt
`;
