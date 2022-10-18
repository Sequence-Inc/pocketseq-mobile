import { gql, useLazyQuery } from "@apollo/client";
import { Space, SPACE, SpaceType, SPACE_TYPE_LIST } from "../../domains";

const SPACE_BY_ID = gql`
  query SpaceById($id: ID!) {
    spaceById(id: $id) {
      ${SPACE}
    }
  }
`;

export type SpaceByIdInput = {
  id: string;
};

export interface SpaceByIdResult {
  spaceById: Space;
}

const AVAILABLE_SPACE_TYPES = gql`
  query SpaceTypes {
    availableSpaceTypes {
      ${SPACE_TYPE_LIST}
    }
  }
`;

export interface AvailableSpaceTypesResult {
  availableSpaceTypes: SpaceType;
}

export const useSpace = () => {
  const [spaceById] = useLazyQuery<SpaceByIdResult, SpaceByIdInput>(
    SPACE_BY_ID
  );
  const [getAvailableSpaceTypes] = useLazyQuery<AvailableSpaceTypesResult>(
    AVAILABLE_SPACE_TYPES
  );
  return { spaceById, getAvailableSpaceTypes };
};
