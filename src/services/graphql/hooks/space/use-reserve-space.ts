import { useCallback, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm, useFieldArray } from "react-hook-form";

export const RESERVE_SPACE = gql`
  mutation ReserveSpace($input: ReserveSpaceInput) {
    reserveSpace(input: $input) {
      transactionId
      intentId
      intentCode
      amount
      description
      currency
      reservationId
    }
  }
`;
const GET_SPACE_BY_ID = gql`
  query spaceById($id: ID!) {
    spaceById(id: $id) {
      id
      name
      spaceTypes {
        id
        title
      }
      address {
        id
        addressLine1
        addressLine2
        city
        longitude
        latitude
        postalCode
        prefecture {
          id
          name
          nameKana
        }
      }
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
        description
        paymentTerm
        stock
      }
      subcriptionPrice
    }
  }
`;

export type OptionsType = {
  id: string;
  additionalPrice: string;
  name: string;
  description: string;
  paymentTerm: string;
  stock: number;
};

const useReserveSpace = (spaceId: string) => {
  const {
    data: spaceDetails,
    loading: fetchingSpace,
    error: fetchingSpaceError,
  } = useQuery(GET_SPACE_BY_ID, {
    skip: !spaceId,
    variables: {
      id: spaceId,
    },
  });

  const [reserveSpace, { loading: reservingSpace, data: reservationSuccessData, error: reservationFailure }] =
    useMutation(RESERVE_SPACE, {
      ignoreResults: false,
    });

  const { control } = useForm();

  const { fields: additionalOptionsFields, update: updateAdditionalOptionsFields } = useFieldArray({
    keyName: "additionalOptionFieldId",
    name: "additionalOptions",
    control,
  });

  const initializeAdditionalOptions = useCallback(() => {
    if (!spaceDetails?.spaceById?.additionalOptions?.length) return;
    spaceDetails?.spaceById.additionalOptions?.forEach((additionalOption: OptionsType, index: number) => {
      const stockOptions = Array.from(Array(additionalOption?.stock || 1).keys()).map((val) => ({
        value: val + 1,
        label: val + 1,
      }));
      updateAdditionalOptionsFields(index, {
        id: additionalOption?.id,
        name: additionalOption?.name,
        paymentTerm: additionalOption.paymentTerm,
        additionalPrice: additionalOption.additionalPrice,
        quantity: 1,
        stockOptions,
        maxStock: additionalOption?.stock || 1,
        isChecked: false,
      });
    });
  }, [spaceDetails]);

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

  // const handleSpaceReservation = useCallback(async()=>{},[])

  const handleSpaceReservation = useCallback(async (reservationData) => {
    return reserveSpace({
      variables: {
        input: reservationData,
      },
    });
  }, []);
  // const onReserveHotel = useCallback(async()=>{},[])

  useEffect(initializeAdditionalOptions, [initializeAdditionalOptions]);

  return {
    spaceDetails: spaceDetails?.spaceById,
    fetchingSpace,
    fetchingSpaceError,
    additionalOptionsFields,
    onAdditionalFieldChangeQuantity,
    onAdditionalOptionsCheckboxAction,
    includedOptions: spaceDetails?.spaceById?.includedOptions,
    reservingSpace,
    handleSpaceReservation,
    reservationSuccessData,
    reservationFailure,
  };
};

export default useReserveSpace;
