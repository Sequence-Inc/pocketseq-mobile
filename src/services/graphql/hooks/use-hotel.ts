import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Hotel, HOTEL } from "../../domains";
import React from "react";

const HOTEL_BY_ID = gql`
  query HotelById($id: ID!) {
    hotelById(id: $id) {
      ${HOTEL}
    }
  }
`;

export type HotelByIdInput = {
  id: string;
};

export interface HotelByIdResult {
  hotelById: Hotel;
}

export const useHotel = () => {
  let [hotelById, { loading, error, data }] = useLazyQuery<
    HotelByIdResult,
    HotelByIdInput
  >(HOTEL_BY_ID);
  return { hotelById, loading, error, hotel: data?.hotelById };
};

export const useHotelQuery = () => {
  let [hotelById, { loading, error, data }] = useLazyQuery<
    HotelByIdResult,
    HotelByIdInput
  >(HOTEL_BY_ID);

  const fetchHotelById = React.useCallback(async (id: string) => {
    return hotelById({
      variables: {
        id,
      },
    });
  }, []);
  return { fetchHotelById, loading, error, hotel: data?.hotelById };
};
