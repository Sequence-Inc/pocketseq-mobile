import { gql, useLazyQuery } from "@apollo/client";
import { Space, SPACE, SpaceType, SPACE_TYPE_LIST } from "../../../domains";
import React from "react";

const SPACE_BY_ID = gql`
  query SpaceById($id: ID!) {
    spaceById(id: $id) {
      ${SPACE}
    }
  }
`;

const AVAILABLE_SPACE_TYPES = gql`
  query SpaceTypes {
    availableSpaceTypes {
      ${SPACE_TYPE_LIST}
    }
  }
`;

export type SpaceByIdInput = {
  id: string;
};

export interface SpaceByIdResult {
  spaceById: Space;
}

export interface AvailableSpaceTypesResult {
  availableSpaceTypes: SpaceType;
}

export const useSpace = () => {
  let [spaceById, { loading, error, data }] = useLazyQuery<
    SpaceByIdResult,
    SpaceByIdInput
  >(SPACE_BY_ID, {
    fetchPolicy: "cache-first",
  });

  const fetchSpaceById = React.useCallback(
    (id: string) =>
      spaceById({
        variables: {
          id,
        },
      }),
    [spaceById]
  );

  const [getAvailableSpaceTypes] = useLazyQuery<AvailableSpaceTypesResult>(
    AVAILABLE_SPACE_TYPES
  );

  return {
    spaceById,
    fetchSpaceById,
    loading,
    error,
    data: data?.spaceById,
    getAvailableSpaceTypes,
  };
};
