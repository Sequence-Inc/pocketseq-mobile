import { useCallback, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useReduceObject } from "../utility";
import * as yup from "yup";

import { AsyncStoreUtils } from "../../../storage";

export const GET_PRICE_PLANS = gql`
  query getApplicablePricePlans($input: GetApplicablePricePlansInput) {
    getApplicablePricePlans(input: $input) {
      total
      duration
      durationType
      spaceAmount
      optionAmount
      applicablePricePlans {
        id
        title
        duration
        type
        isDefault
        isOverride
        fromDate
        toDate
        amount
        appliedTimes
      }
    }
  }
`;

export const GET_PRICE_PLANS_WITH_AUTH = gql`
  query ApplicablePricePlansWithAuth(
    $input: GetApplicablePricePlansWithAuthInput
  ) {
    getApplicablePricePlansWithAuth(input: $input) {
      total
      duration
      durationType
      spaceAmount
      optionAmount
      applicablePricePlans {
        id
        title
        duration
        type
        isDefault
        isOverride
        fromDate
        toDate
        amount
        appliedTimes
      }
      subscriptionUnit
      subscriptionAmount
    }
  }
`;

const Calculate_Price_Inputs = [
  "duration",
  "durationType",
  "fromDateTime",
  "spaceId",
  // "additionalOptionsFields",
];

const CALCULATE_PRICE_SCHEME = yup.object().shape({
  duration: yup.string().required(),
  durationType: yup.string().required(),
  fromDateTime: yup.number().required(),
  spaceId: yup.string().required(),
  // additionalOptionsFields: yup.array().optional(),
});

export type TUseCalculateSpacePriceProps = {
  fromDateTime?: any;
  duration?: any;
  durationType?: any;
  spaceId?: any;
  additionalOptionsFields?: any[];
  useSubscription?: boolean;
};

const useCalculateSpacePrice = () => {
  const [loading, setLoading] = useState(false);

  const [priceData, setPriceData] = useState(null);
  const [
    calculatePrice,
    {
      loading: calculatingPrice,
      data: applicablePP,
      error: priceCalculationError,
    },
  ] = useLazyQuery(GET_PRICE_PLANS);

  // const [calculatePriceWithAuth] = useLazyQuery(GET_PRICE_PLANS_WITH_AUTH);

  const fetchCalculatedPrice = useCallback(
    async (props: TUseCalculateSpacePriceProps) => {
      const { additionalOptionsFields, ...rest } = props;
      // setPriceData(null);
      const input = useReduceObject(rest, Calculate_Price_Inputs);
      const isValid = await CALCULATE_PRICE_SCHEME.isValid(input);
      if (!isValid) return;
      let calculatePriceInput = {
        ...input,
        additionalOptions: props?.additionalOptionsFields
          ?.filter((item) => item?.isChecked)
          ?.map((field) => ({
            optionId: field?.id,
            quantity: field.quantity,
          })),
      };

      setLoading(true);

      const data = await calculatePrice({
        variables: {
          input: calculatePriceInput,
        },
      });

      if (data?.data?.getApplicablePricePlans) {
        setPriceData(data.data.getApplicablePricePlans);
      }

      setLoading(false);
    },
    []
  );

  const fetchCalculatedPriceWithAuth = useCallback(
    async (props: TUseCalculateSpacePriceProps) => {
      const { additionalOptionsFields, useSubscription, ...rest } = props;

      const accessToken = await AsyncStoreUtils.getItem("accessToken");

      setPriceData(null);
      const input = useReduceObject(rest, Calculate_Price_Inputs);
      const isValid = await CALCULATE_PRICE_SCHEME.isValid(input);

      if (!isValid) {
        return;
      }
      let calculatePriceInput = {
        ...input,
        useSubscription,
        additionalOptions: additionalOptionsFields
          ?.filter((item) => item?.isChecked)
          ?.map((field) => ({
            optionId: field?.id,
            quantity: field.quantity,
          })),
      };

      return fetch("https://dev-api.pocketseq.com/dev/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(accessToken || "")}`,
        },
        body: JSON.stringify({
          query: `
        query ApplicablePricePlansWithAuth($input: GetApplicablePricePlansWithAuthInput) {
          getApplicablePricePlansWithAuth(input: $input) {
              total
              duration
              durationType
              spaceAmount
              optionAmount
              applicablePricePlans {
                id
                title
                duration
                type
                isDefault
                isOverride
                fromDate
                toDate
                amount
                appliedTimes
              }
              subscriptionUnit
              subscriptionAmount
            }
          }`,
          variables: {
            input: calculatePriceInput,
          },
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result?.data?.getApplicablePricePlansWithAuth) {
            setPriceData(result?.data?.getApplicablePricePlansWithAuth);
          }
        })
        .catch(() => setPriceData(null));
    },
    []
  );
  return {
    fetchCalculatedPrice,
    fetchCalculatedPriceWithAuth,
    loading,
    calculatingPrice,
    calculatedPrice: applicablePP?.getApplicablePricePlans,
    priceCalculationError,
    priceData,
  };
};

export default useCalculateSpacePrice;

export const Utils = { useLazyQuery, gql };
