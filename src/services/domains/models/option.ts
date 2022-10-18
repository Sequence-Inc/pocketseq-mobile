import { PaymentTerm } from "./hotelPlan";
import { PHOTO, Photo } from "./photo";

export interface OptionPriceOverride {
  id: string;
  startDate: number;
  endDate: number;
  price: number;
  createdAt: number;
  updatedAt: number;
}

export const OPTION_PRICE_OVERRIDE = `
  id
  startDate
  endDate
  price
  createdAt
  updatedAt
`;

export type OptionPaymentTerm = PaymentTerm | "PER_USE" | "PER_FLAT";

export interface Option {
  id: string;
  name: string;
  description: string;
  startUsage: number;
  endUsage: number;
  startReservation: number;
  endReservation: number;
  cutOffBeforeDays: number;
  cutOffTillTime: number;
  paymentTerm: OptionPaymentTerm;
  additionalPrice: number;
  stock: number;
  priceOverrides: OptionPriceOverride[];
  photos: Photo[];
  createdAt: number;
  updatedAt: number;
}

export const OPTION = `
  id
  name
  description
  startUsage
  endUsage
  startReservation
  endReservation
  cutOffBeforeDays
  cutOffTillTime
  paymentTerm
  additionalPrice
  stock
  priceOverrides {
    ${OPTION_PRICE_OVERRIDE}
  }
  photos {
    ${PHOTO}
  }
  createdAt
  updatedAt
`;
