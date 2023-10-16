import { gql, useMutation } from "@apollo/client";
import { UserReservationHotel, USER_RESERVATION_HOTEL } from "../../../domains";
import { isEmpty } from "lodash";
import { useAppClient } from "../../app-client";
import { MutationHook } from "../../types";

export type CancelHotelReservationVariables = {
  input: { hotelRoomReservationId: string };
};

export type CancelHotelReservationResult = {
  cancelRoomReservation: {
    message: string;
  };
};

const CancelHotelReservation = gql`
  mutation CancelRoomReservation($input: CancelRoomReservationInput!) {
    cancelRoomReservation(input: $input) {
      message
    }
  }
`;

export const useCancelHotelReservation: MutationHook<
  CancelHotelReservationResult,
  UserReservationHotel
> = () => {
  const client = useAppClient();
  let [mutation, result] = useMutation<
    CancelHotelReservationResult,
    CancelHotelReservationVariables
  >(CancelHotelReservation);
  async function cancelHotelReservation(reservation: UserReservationHotel) {
    if (isEmpty(reservation) || isEmpty(reservation.id))
      throw new Error("Invalid Reservation Id!!");
    const cancelResult = await mutation({
      variables: { input: { hotelRoomReservationId: reservation.id } },
      fetchPolicy: "no-cache",
    });
    console.log(cancelResult);

    if (cancelResult.data) {
      client.writeQuery({
        query: gql`
        query WriteHotelRoomReservation($id: ID!) {
          hotelRoomReservation(id: $id) {
            ${USER_RESERVATION_HOTEL}
          }
        }
      `,
        data: {
          hotelRoomReservation: {
            __typename: "HotelRoomReservationObject",
            ...reservation,
            status: "CANCELED",
          },
        },
        variables: { id: reservation.id },
      });
    }
    return cancelResult;
  }
  return [cancelHotelReservation, result];
};
