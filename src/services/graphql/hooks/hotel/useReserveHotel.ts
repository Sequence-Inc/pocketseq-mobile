import { useCallback, useEffect, useState } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useFieldArray, useForm } from "react-hook-form";

export const RESERVE_HOTEL_ROOM = gql`
  mutation ReserveHotelRoom($input: ReserveHotelRoomInput!) {
    reserveHotelRoom(input: $input) {
      amount
      currency
      description
      intentCode
      intentId
      paymentMethodTypes
      reservationId
      transactionId
      subscriptionPrice
      subscriptionUnit
    }
  }
`;

const DEFAULT_OPTIONS_QUANTITY = 1,
  DEFAULT_DAY = 1;

const GET_PACKAGE_PLAN_BY_ID = gql`
  query PackagePlanById($id: ID!) {
    packagePlanById(id: $id) {
      includedOptions {
        id
        additionalPrice
        name
        description
        paymentTerm
        stock
      }
      additionalOptions {
        id
        additionalPrice
        name
        paymentTerm
        stock
      }
    }
  }
`;

// {
//     paymentSourceId,
//     roomPlanId,
//     checkInDate,
//     checkOutDate,
//     nAdult,
//     nChild,
//     additionalOptions
// }

type TReserveHotelProps = {
  paymentSourceId?: string;
  checkInDate?: any;
  checkOutDate?: any;
  nAdult?: number;
  nChild?: number;
  plan?: string;
  roomPlanId?: string;
};

type OptionsType = {
  id: string;
  additionalPrice: string;
  name: string;
  description: string;
  paymentTerm: string;
  stock: number;
};

export const useReserveHotel = (formData?: TReserveHotelProps) => {
  const { data: planDetails, loading: fetchingPlanDetails } = useQuery(GET_PACKAGE_PLAN_BY_ID, {
    fetchPolicy: "network-only",
    skip: !formData?.plan,
    variables: {
      id: formData?.plan,
    },
  });

  const [loading, setLoading] = useState(false);

  const {
    register,
    unregister,
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    getValues,
  } = useForm();

  const [reserveHotelSpace, { loading: reservingHotel, data: reservedHotelSuccessData, error: reserveHotelError }] =
    useMutation(RESERVE_HOTEL_ROOM, {
      ignoreResults: false,
    });

  const handleHotelReservation = useCallback(async (reservationData) => {
    return reserveHotelSpace({
      variables: {
        input: {
          ...reservationData,
        },
      },
    });
  }, []);

  const { fields: additionalOptionsFields, update: updateAdditionalOptionsFields } = useFieldArray({
    keyName: "additionalOptionFieldId",
    name: "additionalOptions",
    control,
  });

  const initializeAdditionalOptions = useCallback(() => {
    if (!planDetails?.packagePlanById?.additionalOptions?.length) return;

    planDetails?.packagePlanById?.additionalOptions?.forEach((additionalOption: OptionsType, index: number) => {
      const stockOptions = Array.from(Array(additionalOption?.stock || 1).keys()).map((val) => ({
        value: val + 1,
        label: val + 1,
      }));
      updateAdditionalOptionsFields(index, {
        id: additionalOption?.id,
        name: additionalOption?.name,
        paymentTerm: additionalOption.paymentTerm,
        additionalPrice: additionalOption.additionalPrice,
        quantity: DEFAULT_OPTIONS_QUANTITY,
        stockOptions,
        maxStock: additionalOption?.stock || 1,
        isChecked: false,
      });
    });
  }, [planDetails]);

  const onAdditionalOptionsCheckboxAction = useCallback(
    (optionIndex, val) => {
      updateAdditionalOptionsFields(optionIndex, {
        ...additionalOptionsFields[optionIndex],
        isChecked: val,
      });
    },
    [additionalOptionsFields]
  );

  const onAdditionalFieldChangeQuantity = useCallback(
    (value, index) => {
      updateAdditionalOptionsFields(index, {
        ...additionalOptionsFields[index],
        quantity: value,
      });
    },
    [additionalOptionsFields]
  );

  // const onReserveHotel = useCallback(async()=>{},[])

  useEffect(initializeAdditionalOptions, [initializeAdditionalOptions]);
  useEffect(() => {
    if (formData) {
      setValue("paymentSourceId", formData.paymentSourceId);
      setValue("checkInDate", formData.checkInDate);
      setValue("checkOutDate", formData.checkOutDate);
      setValue("nAdult", formData.nAdult);
      setValue("nChild", formData.nChild);
      setValue("plan", formData.plan);
      setValue("roomPlanId", formData.roomPlanId);
    }
  }, [formData]);

  return {
    register,
    unregister,
    control,
    errors,
    watch,
    setValue,
    handleSubmit,
    getValues,
    onAdditionalOptionsCheckboxAction,
    additionalOptionsFields,
    onAdditionalFieldChangeQuantity,
    includedOptions: planDetails?.packagePlanById?.includedOptions,
    handleHotelReservation,
    reservingHotel,
    reservedHotelSuccessData,
    reserveHotelError,
  };
};
