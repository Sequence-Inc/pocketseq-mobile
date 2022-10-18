import { gql, useLazyQuery } from "@apollo/client";
import { Space, SPACE } from "../../../domains";
import React from "react";

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
  return { spaceById, fetchSpaceById, loading, error, data: data?.spaceById };
};
