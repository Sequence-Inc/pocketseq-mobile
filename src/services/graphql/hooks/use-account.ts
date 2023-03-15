import { gql, useLazyQuery } from "@apollo/client";
import { PAYMENT_SOURCE, PaymentSource } from "../../domains";

const GET_PAYMENT_SOURCES = gql`
  query PaymentSource {
    paymentSource {
      ${PAYMENT_SOURCE}
    }
  }
`;

export interface PaymentSourceResult {
  paymentSource: PaymentSource[];
}

export const useAccount = () => {
  const [getPaymentSources, { data, loading, error }] =
    useLazyQuery<PaymentSourceResult>(GET_PAYMENT_SOURCES);

  return { getPaymentSources, data, loading, error };
};
