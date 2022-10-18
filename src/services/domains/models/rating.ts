export interface Rating {
  id: number;
  rating: number;
  comment: string;
  spaceId: string;
  byAccountId: string;
  createdAt: number;
  updatedAt: number;
}

export const RATING = `
  id:
  rating
  comment
  spaceId
  byAccountId
  createdAt
  updatedAt
`;
