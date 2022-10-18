import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Space, SPACE } from "../../domains";
import { SpaceType, SPACE_TYPE } from "../../domains";
import {
  PaginationOption,
  PaginationResult,
  PAGINATION_RESULT,
} from "../../domains";
import { Hotel, HOTEL } from "../../domains";

export type TopPicksResult = {
  availableSpaceTypes: SpaceType[];
  allSpaces: {
    data: Space[];
    paginationInfo: PaginationResult;
  };
  allPublishedHotels: Hotel[];
};

export type TopPicksInput = {
  paginate: PaginationOption;
};

const TOP_PICKS = gql`
  query TopPicks($paginate: PaginationOption) {
    allSpaces(paginate: $paginate) {
      data {
        ${SPACE}
      }
      paginationInfo {
        ${PAGINATION_RESULT}
      }
    }

    availableSpaceTypes {
        ${SPACE_TYPE}
    }

    allPublishedHotels {
        ${HOTEL}
    }
  }
`;

export const useHomeScreen = ({ take, skip }: PaginationOption) => {
  let [getTopPicks] = useLazyQuery<TopPicksResult, TopPicksInput>(TOP_PICKS, {
    variables: { paginate: { take, skip } },
  });
  return { getTopPicks };
};
