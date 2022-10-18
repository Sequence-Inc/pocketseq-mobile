export type SubscriptionCategoryType = "A" | "B" | "C";
export interface SubscriptionPrice {
  id: string;
  amount: number;
  currency: string;
  name: string;
  priceRange: string;
}

export const SUBSCRIPTION_PRICE = `
  id
  amount
  currency
  name
  priceRange
`;

export interface Subscription {
  id: string;
  name: string;
  title: string;
  type: string;
  unit: string;
  prices: SubscriptionPrice[];
}

export const SUBSCRIPTION = `
  id:
  name
  title
  type
  unit
  prices {
    ${SUBSCRIPTION_PRICE}
  }
`;
