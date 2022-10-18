import React from "react";
import { useLazyQuery } from "@apollo/client";

import { GET_PRICE_PLANS } from "./useCalculateSpacePrice";

const useApplicablePricePlans = () => {
  const [getApplicablePricePlans, { loading, data, error }] = useLazyQuery(GET_PRICE_PLANS);

  const fetchApplicatblePricePlans = React.useCallback(
    async ({ fromDateTime, duration, durationType, spaceId }) => {
      return getApplicablePricePlans({
        variables: {
          input: {
            fromDateTime,
            duration,
            durationType,
            spaceId,
          },
        },
      });
    },
    [getApplicablePricePlans]
  );

  return { fetchApplicatblePricePlans, loading, data: data?.getApplicablePricePlans, error };
};

export default useApplicablePricePlans;
