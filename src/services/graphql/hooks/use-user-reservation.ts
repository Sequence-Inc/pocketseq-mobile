import { gql, useLazyQuery } from "@apollo/client";
import {
  USER_RESERVATION_SPACE,
  PAGINATION_RESULT,
  UserReservationSpace,
  PaginationResult,
  USER_RESERVATION_HOTEL,
  UserReservationHotel,
  PaginationOption,
  SpaceReservationFilter,
  HotelReservationFilter,
} from "../../domains";
import { QueryHook } from "../types";

export interface MyReservationsResult {
  myReservations: {
    data: UserReservationSpace[];
    paginationInfo: PaginationResult;
  };
  myHotelRoomReservation: {
    data: UserReservationHotel[];
    paginationInfo: PaginationResult;
  };
}

export type MyReservationsVariables = {
  paginate?: PaginationOption;
  filter_space?: SpaceReservationFilter;
  filter_hotel?: HotelReservationFilter;
};

export type SpaceReservationByIdVariables = {
  id: string;
};
export type HotelReservationByIdVariables = {
  id: string;
};
export type SpaceReservationResult = {
  reservationById: UserReservationSpace;
};
export type HotelReservationResult = {
  hotelRoomReservationById: UserReservationHotel;
};

const GET_RESERVATIONS = gql`
  query MyReservations ($paginate: PaginationOption, $filter_space: MyReservationFilter, $filter_hotel: MyHotelRoomReservationFilter ) {
    myReservations (paginate: $paginate, filter: $filter_space) {
      data {
        ${USER_RESERVATION_SPACE}
      }
      paginationInfo {
        ${PAGINATION_RESULT}
      }
    }
    myHotelRoomReservation (paginate: $paginate, filter: $filter_hotel) { 
      data { 
        ${USER_RESERVATION_HOTEL} 
      }
      paginationInfo { 
        ${PAGINATION_RESULT} 
      } 
    }
  }
`;

const GET_SPACE_RESERVATION_BY_ID = gql`
  query SpaceReservationById ($id: ID!) {
    reservationById (id: $id) {
      ${USER_RESERVATION_SPACE}
    }
  }
`;

const GET_HOTEL_RESERVATION_BY_ID = gql`
  query HotelReservationById ($id: ID!) {
    hotelRoomReservationById (id: $id) {
      ${USER_RESERVATION_HOTEL}
    }
  }
`;

export const useUserReservation: QueryHook<
  MyReservationsResult,
  MyReservationsVariables,
  true
> = () => {
  const [query, result] = useLazyQuery<
    MyReservationsResult,
    MyReservationsVariables
  >(GET_RESERVATIONS);
  async function myReservations(variables: MyReservationsVariables) {
    return await query({ variables });
  }

  return [myReservations, result];
};

export const useSpaceReservationById: QueryHook<
  SpaceReservationResult,
  SpaceReservationByIdVariables,
  true
> = () => {
  const [spaceReservationByIdQuery, spaceReservationByIdResult] = useLazyQuery<
    SpaceReservationResult,
    SpaceReservationByIdVariables
  >(GET_SPACE_RESERVATION_BY_ID);

  async function getSpaceReservationById(
    variables: SpaceReservationByIdVariables
  ) {
    return await spaceReservationByIdQuery({ variables });
  }

  return [getSpaceReservationById, spaceReservationByIdResult];
};

export const useHotelReservationById: QueryHook<
  HotelReservationResult,
  HotelReservationByIdVariables,
  true
> = () => {
  const [hotelReservationByIdQuery, hotelReservationByIdResult] = useLazyQuery<
    HotelReservationResult,
    HotelReservationByIdVariables
  >(GET_HOTEL_RESERVATION_BY_ID);

  async function getHotelReservationById(
    variables: HotelReservationByIdVariables
  ) {
    return await hotelReservationByIdQuery({ variables });
  }

  return [getHotelReservationById, hotelReservationByIdResult];
};
