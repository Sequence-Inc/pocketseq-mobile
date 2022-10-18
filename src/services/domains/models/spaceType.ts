import { Photo, PHOTO } from "./photo";

export const SPACE_TYPE = `
  id
  title
  description
  photo {
    ${PHOTO}
  }
`;

export const SPACE_TYPE_LIST = `
  id
  title
`;

export interface SpaceType {
  id: string;
  title: string;
  description?: string;
  photo?: Photo;
}
