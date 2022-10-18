export interface SpaceSetting {
  id: string;
  totalStock: number;
  isDefault: boolean;
  closed: boolean;
  businessDays: number[];
  openingHr: number;
  closingHr: number;
  breakFromHr: number;
  breakToHr: number;
  fromDate: number;
  toDate: number;
}

export const SPACE_SETTING = `
  id:
  totalStock
  isDefault
  closed
  businessDays
  openingHr
  closingHr
  breakFromHr
  breakToHr
  fromDate
  toDate
`;
