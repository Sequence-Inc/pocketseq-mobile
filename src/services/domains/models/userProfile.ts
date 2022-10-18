import { ADDRESS, Address } from "./address";
import { PHOTO, Photo } from "./photo";

export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  phoneNumber: string;
  profilePhoto: Photo;
}

export const USER_PROFILE = `
  id
  email
  emailVerified
  firstName
  lastName
  firstNameKana
  lastNameKana
  phoneNumber
  
`;
