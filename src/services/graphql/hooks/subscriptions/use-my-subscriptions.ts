import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { SUBSCRIPTION_OBJECT } from "./schema";

export const MY_SUBSCRIPTIONS = gql`
    query MySubscriptions{
        mySubscriptions{
        ${SUBSCRIPTION_OBJECT}
        }
    }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($id: ID!) {
    cancelSubscription(id: $id) {
      message
    }
  }
`;

export const useFetchSubscriptions = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [
    getSubscriptions,
    {
      data: subscriptions,
      loading: fetchingSubscriptions,
      error: fetchingSubscriptionError,
      refetch: refetchSubscriptions,
    },
  ] = useLazyQuery(MY_SUBSCRIPTIONS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    setIsReady(fetchingSubscriptions);
  }, [fetchingSubscriptions]);

  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION, {
    onCompleted: (data) => {
      alert(data.cancelSubscription.message);
      refetchSubscriptions();
      setIsReady(true);
    },
    onError: (error) => {
      alert(error.message);
      setIsReady(true);
    },
  });

  return {
    getSubscriptions,
    subscriptions,
    fetchingSubscriptions,
    fetchingSubscriptionError,
    refetchSubscriptions,
    cancelSubscription,
    isReady,
    setIsReady,
  };
};
