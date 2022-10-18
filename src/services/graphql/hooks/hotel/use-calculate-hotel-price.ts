import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React from "react";

import { useCallback, useState } from "react";
import { AsyncStoreUtils } from "../../../storage";

export const CALCULATE_ROOM_PRICE_PLAN = gql`
  query CalculateRoomPricePlan($input: CalculateRoomPlanInput!) {
    calculateRoomPlanPrice(input: $input) {
      appliedRoomPlanPriceSettings
      appliedRoomPlanPriceOverrides
      totalAmount
      planAmount
    }
  }
`;

export const CALCULATE_ROOM_PRICE_PLAN_WITH_AUTH = gql`
  query CalculateRoomPlanPriceWithAuthInput(
    $input: CalculateRoomPlanPriceWithAuthInput!
  ) {
    calculateRoomPlanPriceWithAuth(input: $input) {
      appliedRoomPlanPriceSettings
      appliedRoomPlanPriceOverrides
      subscriptionUnit
      subscriptionAmount
      totalAmount
      planAmount
    }
  }
`;

export const CALCULATE_ROOM_PLAN_PRICE = gql`
  query CalculateRoomPlanPrice($input: CalculateRoomPlanInput!) {
    calculateRoomPlanPrice(input: $input) {
      totalAmount
      appliedRoomPlanPriceSettings
      appliedRoomPlanPriceOverrides
    }
  }
`;

export const useCalculateHotelPrice = () => {
  const [
    calculatePrice,
    { loading: calculatingPrice, error: priceCalculationError, data },
  ] = useLazyQuery(CALCULATE_ROOM_PLAN_PRICE);

  const fetchHotelPrice = React.useCallback(
    async ({ selectedRoom, startDate, endDate, noOfAdults, noOfChild }) => {
      return calculatePrice({
        variables: {
          input: {
            roomPlanId: selectedRoom.id,
            checkInDate: startDate?.startOf("day").valueOf(),
            checkOutDate: endDate?.startOf("day").valueOf(),
            nAdult: noOfAdults,
            nChild: noOfChild,
          },
        },
      });
    },
    []
  );

  return {
    fetchHotelPrice,
    calculatingPrice,
    priceCalculationError,
    priceDate: data?.calculateRoomPlanPrice,
  };
};

type TCalculatePriceProps = {
  roomPlanId?: string;
  checkInDate?: any;
  checkOutDate?: any;
  nAdult?: number;
  nChild?: number;
  additionalOptionsFields?: any[];
};

export const useCalculatePriceWithOptions = () => {
  const [loading, setLoading] = useState(false);

  const [priceData, setPriceData] = useState(null);
  const [
    calculatePrice,
    {
      data: priceCalculation,
      loading: calculatingPrice,
      error: priceCalculationError,
    },
  ] = useLazyQuery(CALCULATE_ROOM_PRICE_PLAN, {
    fetchPolicy: "network-only",
  });

  const [calculatePriceWithAuth] = useLazyQuery(
    CALCULATE_ROOM_PRICE_PLAN_WITH_AUTH,
    {
      fetchPolicy: "network-only",
    }
  );

  const fetchCalculatedPrice = useCallback(
    async (props: TCalculatePriceProps) => {
      let calculatePriceInput = {
        roomPlanId: props?.roomPlanId,
        nAdult: props?.nAdult,
        nChild: props?.nChild,
        checkInDate: props?.checkInDate?.startOf("day").valueOf(),
        checkOutDate: props?.checkOutDate?.startOf("day").valueOf(),
        additionalOptions: props?.additionalOptionsFields
          ?.filter((item) => item?.isChecked)
          ?.map((field) => ({
            optionId: field?.id,
            quantity: field.quantity,
          })),
      };
      setPriceData(null);

      setLoading(true);
      const data = await calculatePrice({
        variables: {
          input: calculatePriceInput,
        },
      });

      if (data?.data?.calculateRoomPlanPrice) {
        setPriceData(data.data.calculateRoomPlanPrice);
      }
      setLoading(false);
    },
    []
  );

  const fetchCalculatePriceWithAuth = useCallback(
    async (props: TCalculatePriceProps & { useSubscription?: boolean }) => {
      const { additionalOptionsFields, useSubscription, ...rest } = props;
      const accessToken = await AsyncStoreUtils.getItem("accessToken");

      let calculatePriceInput = {
        roomPlanId: props?.roomPlanId,
        nAdult: props?.nAdult,
        nChild: props?.nChild,
        checkInDate: props?.checkInDate?.startOf("day").valueOf(),
        checkOutDate: props?.checkOutDate?.startOf("day").valueOf(),
        additionalOptions: props?.additionalOptionsFields
          ?.filter((item) => item?.isChecked)
          ?.map((field) => ({
            optionId: field?.id,
            quantity: field.quantity,
          })),

        useSubscription: !!useSubscription,
      };

      return fetch("https://dev-api.pocketseq.com/dev/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(accessToken || "")}`,
        },
        body: JSON.stringify({
          query: `
          query CalculateRoomPlanPriceWithAuthInput($input: CalculateRoomPlanPriceWithAuthInput!) {
            calculateRoomPlanPriceWithAuth(input: $input) {
              appliedRoomPlanPriceSettings
              appliedRoomPlanPriceOverrides
              subscriptionUnit
              subscriptionAmount
              totalAmount
              planAmount
            }
          }
            `,
          variables: {
            input: calculatePriceInput,
          },
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log({ result });
          if (result?.data?.calculateRoomPlanPriceWithAuth) {
            setPriceData(result?.data?.calculateRoomPlanPriceWithAuth);
          }
        })
        .catch((err) => {
          console.log({ err });
          setPriceData(null);
        });
    },
    []
  );

  return {
    fetchCalculatedPrice,
    priceCalculation,
    calculatingPrice,
    priceCalculationError,
    fetchCalculatePriceWithAuth,
    loading,
    priceData,
  };
};
