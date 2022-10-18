import { gql, useQuery } from "@apollo/client";
import { SUBSCRIPTION_OBJECT } from "./schema";

export const MY_SUBSCRIPTIONS = gql`
    query MySubscriptions{
        mySubscriptions{
        ${SUBSCRIPTION_OBJECT}
        }
    }
`;
export const useFetchSubscriptions = () => {
  const {
    data: subscription,
    loading: fetchingSubscriptions,
    error,
  } = useQuery(MY_SUBSCRIPTIONS, {
    fetchPolicy: "cache-first",
  });

  return { subscription, fetchingSubscriptions, fetchingSubscriptionError: error };
};
