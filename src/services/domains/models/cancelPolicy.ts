export interface CancelPolicyRate {
  beforeHours: number;
  percentage: number;
}

export const CANCEL_POLICY_RATE = `
  beforeHours
  percentage
`;

export interface CancelPolicy {
  id: string;
  name: string;
  description: string;
  rates: CancelPolicyRate[];
  createdAt: number;
  updatedAt: number;
}

export const CANCEL_POLICY = `
  id
  name
  description
  rates {
    ${CANCEL_POLICY_RATE}
  }
  createdAt
  updatedAt
`;
