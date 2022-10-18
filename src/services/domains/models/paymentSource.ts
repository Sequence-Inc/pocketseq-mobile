export const PAYMENT_SOURCE = `
  id
  token
  type
  expMonth
  expYear
  last4
  brand
  country
  isDefault
`;

export type PaymentSourceBrand = "amex" | "discover" | "generic" | "jcb" | "mastercard" | "unionpay" | "visa";

export interface PaymentSource {
  id: string;
  customer: string;
  token: string;
  type: string;
  expMonth: number;
  expYear: number;
  last4: string;
  brand: PaymentSourceBrand;
  country: string;
  isDefault: boolean;
}
