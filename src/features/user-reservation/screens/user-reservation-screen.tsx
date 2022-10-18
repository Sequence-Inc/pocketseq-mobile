import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import UserReservationCoordinator from "../user-reservation-coordinator";
import {
  UserReservationHotel,
  UserReservationSpace,
} from "../../../services/domains";
import { RouteProp, useRoute } from "@react-navigation/native";
import moment from "moment";
import { currencyFormatter } from "../../../widgets/search-list-item/search-list-item";
import { Button } from "../../../widgets/button";
import { Touchable } from "../../../widgets/touchable";
import {
  useCancelHotelReservation,
  useCancelSpaceReservation,
} from "../../../services/graphql";

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
  const headerHeight = useHeaderHeight();
  const { colors, images, strings } = useResources();

  const route: RouteProp<{ params: IUserReservationScreenParams }> = useRoute();
  const { type, data } = route.params;

  const [cancelHotelReservation, cancelHotelReservationResult] =
    useCancelHotelReservation();
  const [cancelSpaceReservation, cancelSpaceReservationResult] =
    useCancelSpaceReservation();

  const [showModal, setShowModal] = useState(false);

  console.log(data.id, data.reservationId);
  const onConfirmCancellationPress = useCallback(async () => {
    setShowModal(false);

    if (type === "HOTEL") await cancelHotelReservation(data);
    else if (type === "SPACE") await cancelSpaceReservation(data);

    coordinator.goBack();
  }, []);

  // const planTypes = [
  //   { title: "DAILY", label: "日" },
  //   { title: "HOURLY", label: "時間" },
  //   { title: "MINUTES", label: "分" },
  // ];

  // const durationSuffix = (type: SpacePricePlanType) => {
  //   return planTypes.filter((plan) => plan.title === type)[0].label;
  // };

  // const currencyFormatter = (amount: number): string => {
  //   // return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
  //   return amount.toString();
  // };
  const fromDateTime = moment(data.fromDateTime);
  const toDateTime = moment(data.toDateTime);

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
        <View style={{ paddingHorizontal: 12, paddingVertical: 18 }}>
          <Text
            style={{ fontSize: 24, color: colors.primary, fontWeight: "600" }}
          >
            {type === "HOTEL" ? data.packagePlan.name : data.space.name}
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
            style={{ fontSize: 14, color: "rgba(150,150,150,1)", marginTop: 4 }}
          >
            {fromDateTime.format("YYYY年MM月DD日")}〜
            {toDateTime.format("MM月DD日")}まで
          </Text>
        </View>

        {/* Reservation Id */}
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
            {data.id}
          </Text>
        </View>

        {/* From Date Time */}
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

        {/* To Date Time */}
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

        {/* To Date Time */}
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
            {data.status}
          </Text>
        </View>

        {/* Reservation approved on */}
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
            {data.approvedOn
              ? moment(data.approvedOn).format("YYYY年MM月DD日")
              : "-"}
          </Text>
        </View>

        {type === "SPACE" && (
          /* Plan */
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
                  color: "rgba(150,150,150,1)",
                }}
              >
                {data.space.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
              >
                {data.space.description}
              </Text>
            </View>
          </View>
        )}
        {type === "HOTEL" && (
          /* Plan */
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
                  color: "rgba(150,150,150,1)",
                }}
              >
                {data.packagePlan.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
              >
                {data.packagePlan.description}
              </Text>
            </View>
          </View>
        )}
        {type === "HOTEL" && (
          /* Room */
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
                  color: "rgba(150,150,150,1)",
                }}
              >
                {data.hotelRoom.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(150,150,150,1)",
                  marginTop: 4,
                }}
              >
                {data.hotelRoom.description}
              </Text>
            </View>
          </View>
        )}
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
              {currencyFormatter(data.transaction.amount)}
            </Text>
          </View>
        </View>
        {data.status !== "CANCELED" &&
          data.status !== "DISAPPROVED" &&
          data.status !== "FAILED" && (
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
