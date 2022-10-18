export interface PaginationOption {
  take: number;
  skip: number;
  after?: string;
}

export interface PaginationResult {
  hasNext: boolean;
  hasPrevious: boolean;
  nextCursor: string;
}

export const PAGINATION_RESULT = `
  hasNext
  hasPrevious
  nextCursor
`;
