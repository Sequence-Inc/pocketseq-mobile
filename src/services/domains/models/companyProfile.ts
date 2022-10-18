import { ADDRESS, Address } from "./address";
import { PHOTO, Photo } from "./photo";

export interface CompanyProfile {
  id: string;
  accountId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  nameKana: string;
  phoneNumber: string;
  registrationNumber: string;
  address: Address;
  profilePhoto: Photo;
  approved: boolean;
  suspended: boolean;
  createdAt: number;
  updatedAt: number;
}

export const COMPANY_PROFILE = `
  id:
  accountId
  email
  emailVerified
  name
  nameKana
  phoneNumber
  registrationNumber
  phoneNumber
  address {
    ${ADDRESS}
  }
  profilePhoto {
    ${PHOTO}
  }
  stripeCustomerId
  approved
  suspended
  createdAt
  updatedAt
`;
