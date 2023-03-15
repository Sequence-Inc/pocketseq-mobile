import { Photo } from "./photo";

interface UserProfile {
  firstName: string;
  firstNameKana: string;
  lastName: string;
  lastNameKana: string;
}

interface CompanyProfile {
  name: string;
  nameKana: string;
  registrationNumber?: string;
}

export interface Profile extends UserProfile, CompanyProfile {
  id: string;
  accountId: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  profilePhoto?: Photo;
  dob?: string;
}
