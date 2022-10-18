import { useMutation, gql } from "@apollo/client";
import { useCallback, useState } from "react";
import { SUBSCRIPTION_OBJECT } from "./schema";

type CreateSubscriptionProps = {
  onCompleted: Function;
  onError: Function;
};

export const CREATE_SUBSCRIPTION = gql`
    mutation CreateSubscription($priceId:ID!){
        createSubscription(priceId:$priceId){
        message
        subscription {
            ${SUBSCRIPTION_OBJECT}
        }
        }
    }
`;

export const useBuySubscription = ({ onCompleted, onError }: CreateSubscriptionProps) => {
  const [buySubscription, { data, error, reset, loading: creatingSubscription }] = useMutation(CREATE_SUBSCRIPTION, {
    onCompleted: () => {
      onCompleted();
    },
    onError: () => {
      onError();
    },
  });

  const onSubmit = useCallback(async (priceId) => {
    return buySubscription({
      variables: {
        priceId,
      },
    });
  }, []);

  return {
    creatingSubscription,
    subscriptionSuccessful: data?.createSubscription,
    subscriptionFailed: error,
    buySubscription,
    onBuySubscription: onSubmit,
    resetSubscription: reset,
  };
};
