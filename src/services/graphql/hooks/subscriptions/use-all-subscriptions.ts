import { gql, useQuery } from "@apollo/client";
import { ALL_SUBSCRIPTION_OBJECT } from "./schema";

export const ALL_SUBSCRIPTION_PRODUCTS = gql`
    query AllSubscriptionProducts{
        allSubscriptionProducts{
        ${ALL_SUBSCRIPTION_OBJECT}
        }
    }
`;
export const useFetchAllSubscriptions = () => {
  const {
    data: allSubscription,
    loading: fetchingAllSubscriptions,
    error,
  } = useQuery(ALL_SUBSCRIPTION_PRODUCTS, {
    fetchPolicy: "cache-first",
  });

  return {
    allSubscription: allSubscription?.allSubscriptionProducts,
    fetchingAllSubscriptions,
    fetchingAllSubscriptionError: error,
  };
};
