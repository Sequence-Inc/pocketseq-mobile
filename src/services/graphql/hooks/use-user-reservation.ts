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
