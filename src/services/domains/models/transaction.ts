import { PaymentSource, PAYMENT_SOURCE } from "./paymentSource";

export type TransactionStatus =
  | "CREATED"
  | "REQUESTED"
  | "REQUEST_SUCCESSFULL"
  | "WEBHOOK_RECEIVED"
  | "SUCCESSFULL"
  | "FAILED"
  | "CANCELED";

export interface PaymentSourceInfo {
  brand: string;
  last4: string;
  country: string;
  expYear: number;
  expMonth: number;
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethodInfo: PaymentSourceInfo;
}

export const PAYMENT_METHOD_INF0 = `
  brand
  last4
  country
  expYear
  expMonth
`;

export const TRANSACTION = `
  id
  amount
  currency
  status
  paymentMethodInfo {
    ${PAYMENT_METHOD_INF0}
  }
`;
