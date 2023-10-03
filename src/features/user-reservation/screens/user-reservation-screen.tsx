import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import UserReservationCoordinator from "../user-reservation-coordinator";
import {
  UserReservationHotel,
  UserReservationSpace,
} from "../../../services/domains";
import { RouteProp, useRoute } from "@react-navigation/native";
import moment from "moment";
import { Button } from "../../../widgets/button";
import { Touchable } from "../../../widgets/touchable";
import {
  useCancelHotelReservation,
  useCancelSpaceReservation,
  useHotelReservationById,
  useSpaceReservationById,
} from "../../../services/graphql";
import { currencyFormatter } from "../../../utils/strings";

export type IUserReservationScreenProps = {
  coordinator: UserReservationCoordinator;
};

export type IUserReservationScreenParams = {
  type: "HOTEL" | "SPACE";
  data: UserReservationSpace & UserReservationHotel;
};

export const UserReservationScreen: React.FC<IUserReservationScreenProps> = ({
  coordinator,
}) => {
  const [reservation, setReservation] = useState<
    UserReservationSpace | UserReservationHotel
  >();

  const [showModal, setShowModal] = useState(false);
  const headerHeight = useHeaderHeight();
  const { colors } = useResources();

  const route: RouteProp<{ params: IUserReservationScreenParams }> = useRoute();
  const { type, data } = route.params;

  useEffect(() => {
    if (type && data?.id) {
      fetchReservationDetails(type, data?.id);
    }
  }, [data?.id]);

  const [getSpaceReservationById] = useSpaceReservationById();
  const [getHotelReservationById] = useHotelReservationById();

  const fetchReservationDetails = async (
    type: string,
    reservationId: string
  ) => {
    if (type === "SPACE") {
      const spaceReservationData = await getSpaceReservationById({
        id: reservationId,
      });
      if (spaceReservationData.data) {
        setReservation(
          spaceReservationData.data
            .reservationById as unknown as UserReservationSpace
        );
      }
    } else if (type === "HOTEL") {
      const hotelReservationData = await getHotelReservationById({
        id: reservationId,
      });

      if (hotelReservationData?.data?.hotelRoomReservationById) {
        setReservation(
          hotelReservationData.data
            .hotelRoomReservationById as unknown as UserReservationHotel
        );
      }
    }
    return null;
  };

  const [cancelHotelReservation, cancelHotelReservationResult] =
    useCancelHotelReservation();
  const [cancelSpaceReservation, cancelSpaceReservationResult] =
    useCancelSpaceReservation();

  const onConfirmCancellationPress = useCallback(async () => {
    setShowModal(false);
    if (!reservation) {
      return;
    }
    if (type === "HOTEL")
      await cancelHotelReservation(reservation as UserReservationHotel);
    else if (type === "SPACE")
      await cancelSpaceReservation(reservation as UserReservationSpace);
    coordinator.goBack();
  }, []);

  const content = useCallback(() => {
    if (!reservation) {
      return null;
    }
    const fromDateTime = moment(reservation.fromDateTime);
    const toDateTime = moment(reservation.toDateTime);

    if (type === "SPACE") {
      const reservationData = reservation as UserReservationSpace;
      return (
        <>
          <View style={{ paddingHorizontal: 12, paddingVertical: 18 }}>
            <Text
              style={{ fontSize: 24, color: colors.primary, fontWeight: "600" }}
            >
              {reservationData.space.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                marginTop: 8,
                fontWeight: "500",
              }}
            >
              {toDateTime.diff(fromDateTime, "days")}日間
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(150,150,150,1)",
                marginTop: 4,
              }}
            >
              {fromDateTime.format("YYYY年MM月DD日")}〜
              {toDateTime.format("MM月DD日")}まで
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              予約ID
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {reservationData.reservationId}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              チェックイン
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {fromDateTime.format("YYYY年MM月DD日　HH：mm時")}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              チェックアウト
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {toDateTime.format("YYYY年MM月DD日　HH：mm時")}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              Status
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {reservationData.status}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              Approved on
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {reservationData.approvedOn
                ? moment(reservationData.approvedOn).format("YYYY年MM月DD日")
                : "-"}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              スペース
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgba(150,150,150,1)",
                }}
              >
                {reservationData.space.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
                numberOfLines={3}
              >
                {reservationData.space.description}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 12,
                }}
              >
                {reservationData.space.address.prefecture.name}
                {reservationData.space.address.city}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
              >
                {reservationData.space.address.addressLine1}{" "}
                {reservationData.space.address.addressLine2}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              料金
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgba(150,150,150,1)",
                }}
              >
                {currencyFormatter(reservationData.transaction?.amount || 0)}
              </Text>
            </View>
          </View>
        </>
      );
    } else if (type === "HOTEL") {
      const reservationData = reservation as UserReservationHotel;
      return (
        <>
          <View style={{ paddingHorizontal: 12, paddingVertical: 18 }}>
            <Text
              style={{ fontSize: 24, color: colors.primary, fontWeight: "600" }}
            >
              {reservationData.packagePlan.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                marginTop: 8,
                fontWeight: "500",
              }}
            >
              {toDateTime.diff(fromDateTime, "days")}日間
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(150,150,150,1)",
                marginTop: 4,
              }}
            >
              {fromDateTime.format("YYYY年MM月DD日")}〜
              {toDateTime.format("MM月DD日")}まで
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              予約ID
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {reservationData.reservationId}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              チェックイン
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {fromDateTime.format("YYYY年MM月DD日　HH：mm時")}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              チェックアウト
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {toDateTime.format("YYYY年MM月DD日　HH：mm時")}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              Status
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {reservationData.status}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              Approved on
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(150,150,150,1)" }}>
              {reservationData.approvedOn
                ? moment(reservationData.approvedOn).format("YYYY年MM月DD日")
                : "-"}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              プラン
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgba(100,100,100,1)",
                }}
              >
                {reservationData.packagePlan.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
              >
                {reservationData.packagePlan.description}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              部屋
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgba(100,100,100,1)",
                }}
              >
                {reservationData.hotelRoom.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
              >
                {reservationData.hotelRoom.description}
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textVariant,
                fontWeight: "600",
                width: 120,
                marginRight: 6,
              }}
            >
              料金
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgba(150,150,150,1)",
                }}
              >
                {currencyFormatter(reservationData.transaction.amount)}
              </Text>
            </View>
          </View>
        </>
      );
    } else {
      return null;
    }
  }, [reservation]);

  if (!reservation) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {content()}
        {reservation.status !== "CANCELED" &&
          reservation.status !== "DISAPPROVED" &&
          reservation.status !== "FAILED" && (
            <Button
              containerStyle={{
                backgroundColor: colors.backgroundVariant,
                margin: 12,
              }}
              title="Cancel Reservation"
              loading={
                cancelHotelReservationResult.loading ||
                cancelSpaceReservationResult.loading
              }
              onPress={() => setShowModal(true)}
            />
          )}
      </ScrollView>
      <Modal visible={showModal} transparent={true}>
        <Touchable
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          touchType="none"
          onPress={() => setShowModal(false)}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: colors.background,
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ marginTop: 12, marginBottom: 20 }}>
              Are you sure you want to cancel this reservation?
            </Text>
            <Button
              containerStyle={{ backgroundColor: colors.secondary, margin: 12 }}
              titleStyle={{ color: colors.background }}
              title="Confirm cancellation"
              onPress={onConfirmCancellationPress}
            />
            <Button title="Dismiss" onPress={() => setShowModal(false)} />
          </View>
        </Touchable>
      </Modal>
    </SafeAreaView>
  );
};
