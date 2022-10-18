import { gql, useMutation } from "@apollo/client";
import { UserReservationSpace, USER_RESERVATION_SPACE } from "../../../domains";
import { isEmpty } from "lodash";
import { useAppClient } from "../../app-client";
import { MutationHook } from "../../types";

export type CancelSpaceReservationVariables = {
  input: { reservationId: string };
};

export type CancelSpaceReservationResult = {
  cancelRoomReservation: {
    message: string;
  };
};

const CancelSpaceReservation = gql`
  mutation CancelSpaceReservation($input: CancelReservationInput!) {
    cancelReservation(input: $input) {
      message
      action
    }
  }
`;

export const useCancelSpaceReservation: MutationHook<
  CancelSpaceReservationResult,
  UserReservationSpace
> = () => {
  const client = useAppClient();
  let [mutation, result] = useMutation<
    CancelSpaceReservationResult,
    CancelSpaceReservationVariables
  >(CancelSpaceReservation);
  async function cancelSpaceReservation(reservation: UserReservationSpace) {
    if (isEmpty(reservation) || isEmpty(reservation.id))
      throw new Error("Invalid Reservation Id!!");
    const cancelResult = await mutation({
      variables: { input: { reservationId: reservation.id } },
      fetchPolicy: "no-cache",
    });
    if (cancelResult.data) {
      client.writeQuery({
        query: gql`
        query WriteSpaceReservation($id: ID!) {
          spaceReservation(id: $id) {
            ${USER_RESERVATION_SPACE}
          }
        }
      `,
        data: {
          spaceReservation: {
            __typename: "ReservationObject",
            ...reservation,
            status: "CANCELED",
          },
        },
        variables: { id: reservation.id },
      });
    }
    return cancelResult;
  }
  return [cancelSpaceReservation, result];
};
