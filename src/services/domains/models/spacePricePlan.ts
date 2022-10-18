export interface PricePlanOverride {
  id: string;
  type: "DAY_OF_WEEK" | "DATE_TIME";
  amount: number;
  daysOfWeek: number[];
  fromDate: number;
  toDate: number;
}

export const PRICE_PLAN_OVERRIDE = `
  id
  type
  amount
  daysOfWeek
  fromDate
  toDate
`;

export type SpacePricePlanType = "DAILY" | "HOURLY" | "MINUTES";

export interface SpacePricePlan {
  id: string;
  title: string;
  isDefault: boolean;
  type: SpacePricePlanType;
  duration: number;
  amount: number;
  maintenanceFee: number;
  lastMinuteDiscount: number;
  cooldownTime: number;
  fromDate: number;
  toDate: number;
}

export const SPACE_PRICE_PLAN = `
  id:
  title
  isDefault
  type
  duration
  amount
  maintenanceFee
  lastMinuteDiscount
  cooldownTime
  fromDate
  toDate
`;
