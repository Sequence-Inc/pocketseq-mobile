import { PAYMENT_SOURCE, PaymentSource } from "../../domains";

// const GET_PAYMENT_SOURCES = gql`
//   query PaymentSource {
//     paymentSource {
//       ${PAYMENT_SOURCE}
//     }
//   }
// `;

export interface PaymentSourceResult {
  paymentSource: PaymentSource[];
}

const GET_PAYMENT_SOURCES = {
  operationName: "PaymentSource",
  query: `query PaymentSource { paymentSource { ${PAYMENT_SOURCE} }}`,
  variables: {},
};

export const useAccount = () => {
  // const [getPaymentSources] = useLazyQuery<PaymentSourceResult>(GET_PAYMENT_SOURCES);
  const getPaymentSources = async (token: string) => {
    try {
      const headers = {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      };
      const response = await fetch(
        "https://dev-api.pocketseq.com/dev/graphql",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(GET_PAYMENT_SOURCES),
        }
      );
      const {
        data: { paymentSource },
        errors,
      }: { data: PaymentSourceResult; errors: any | undefined } =
        await response.json();
      return { data: paymentSource, errors };
    } catch (errors) {
      return { data: undefined, errors };
    }
  };

  return { getPaymentSources };
};
