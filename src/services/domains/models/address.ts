import { PREFECTURE, Prefecture } from "./prefecture";

export interface Address {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  longitude: number;
  latitude: number;
  postalCode: string;
  prefecture: Prefecture;
}

export const ADDRESS = `
  id
  addressLine1
  addressLine2
  city
  longitude
  latitude
  postalCode
  prefecture {
    ${PREFECTURE}
  }
`;
