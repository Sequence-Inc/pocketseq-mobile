import React, { useState } from "react";
import { useLazyQuery, gql, useMutation } from "@apollo/client";

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
        setupIntent
    }
`;

export const MAKE_DEFAULT_PAYMENT_SOURCE = gql`
  mutation MakeDefaultPaymentSource($paymentMethodId: ID) {
    setDefaultPaymentMethod(paymentMethodId: $paymentMethodId) {
      message
    }
  }
`;

export const REMOVE_PAYMENT_SOURCE = gql`
  mutation RemovePaymentSource($paymentMethodId: String!) {
    removePaymentMethod(paymentMethodId: $paymentMethodId) {
      message
    }
  }
`;

export function usePaymentMethods() {
  const [loading, setLoading] = useState<boolean>(false);

  const [
    getPaymentMethods,
    {
      data: paymentMethods,
      loading: paymentMethodsLoading,
      error: paymentMethodsError,
      refetch: refetchPaymentMethods,
    },
  ] = useLazyQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });

  const fetchPaymentMethods = React.useCallback(async () => {
    return getPaymentMethods();
  }, []);

  const [makeDefaultPaymentSource] = useMutation(MAKE_DEFAULT_PAYMENT_SOURCE, {
    onCompleted: (data) => {
      refetchPaymentMethods();
      alert(data.setDefaultPaymentMethod.message);
      setLoading(false);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setLoading(false);
    },
  });
  const [removePaymentSource] = useMutation(REMOVE_PAYMENT_SOURCE, {
    onCompleted: (data) => {
      refetchPaymentMethods();
      alert(data.removePaymentMethod.message);
      setLoading(false);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setLoading(false);
    },
  });

  return {
    fetchPaymentMethods,
    paymentMethods,
    paymentMethodsLoading,
    paymentMethodsError,
    refetchPaymentMethods,
    makeDefaultPaymentSource,
    removePaymentSource,
    loading,
    setLoading,
  };
}
