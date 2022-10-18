import React from "react";
import { useLazyQuery, gql } from "@apollo/client";

export const PAYMENT_SOURCE = `
    paymentSource{
        id
        token
        type
        expMonth
        expYear
        last4
        brand
        country
        customer
        isDefault
    }
`;

export const GET_PAYMENT_SOURCES = gql`
    query GetPaymentSources {
        ${PAYMENT_SOURCE}
    }
`;

export function useFetchPaymentMethods() {
  const [getPaymentMethods, { data: paymentMethods, loading: paymentMethodsLoading, error: paymentMethodsError }] =
    useLazyQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });

  const fetchPaymentMethods = React.useCallback(async () => {
    return getPaymentMethods();
  }, []);
  return {
    fetchPaymentMethods,
    paymentMethods,
    paymentMethodsLoading,
    paymentMethodsError,
  };
}
