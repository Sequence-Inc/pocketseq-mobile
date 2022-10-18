import { useResources } from "../../../resources";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, RefreshControl, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import DashboardCoordinator from "../dashboard-coordinator";
import { SVGImage } from "../../../widgets/svg-image";
import { SessionStore } from "../../../services/storage";
import { Button } from "../../../widgets/button";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useUserReservation } from "../../../services/graphql";
import {
  UserReservationHotel,
  UserReservationSpace,
} from "../../../services/domains";
import moment from "moment";
import { Touchable } from "../../../widgets/touchable";

export type IHotelReservationItemProps = IReservationScreenProps & {
  reservation: UserReservationHotel;
};

export type ISpaceReservationItemProps = IReservationScreenProps & {
  reservation: UserReservationSpace;
};

export type IReservationScreenProps = {
  coordinator: DashboardCoordinator;
};

const EmptyHotelComponent: React.FC = () => {
  return (
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text>No Hotel Reservations</Text>
    </View>
  );
};

const HotelReservationItem: React.FC<IHotelReservationItemProps> = ({
  coordinator,
  reservation,
}) => {
  const { colors } = useResources();

  const onItemPress = useCallback(() => {
    coordinator.toUserReservationScreen("navigate", {
      type: "HOTEL",
      data: reservation,
    });
  }, [coordinator, reservation]);

  const fromDateTime = moment(reservation.fromDateTime);
  const toDateTime = moment(reservation.toDateTime);

  return (
    <Touchable
      style={{ backgroundColor: colors.background, margin: 10, padding: 10 }}
      touchType="none"
      onPress={onItemPress}
    >
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 1 }}>
          {toDateTime.diff(fromDateTime, "days")}日間
        </Text>
        <Text>
          {fromDateTime.format("YYYY年MM月DD日")}〜
          {toDateTime.format("MM月DD日")}まで
        </Text>
      </View>
      <Text style={{ color: colors.primary, fontSize: 20, paddingVertical: 5 }}>
        {reservation.packagePlan.name}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 1 }}>{reservation.hotelRoom.name}</Text>
        <Text>{reservation.status}</Text>
      </View>
    </Touchable>
  );
};

const EmptySpaceComponent: React.FC = () => {
  return (
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text>No Space Reservations</Text>
    </View>
  );
};

const SpaceReservationItem: React.FC<ISpaceReservationItemProps> = ({
  coordinator,
  reservation,
}) => {
  const { colors } = useResources();

  const onItemPress = useCallback(() => {
    coordinator.toUserReservationScreen("navigate", {
      type: "SPACE",
      data: reservation,
    });
  }, [coordinator, reservation]);

  const fromDateTime = moment(reservation.fromDateTime);
  const toDateTime = moment(reservation.toDateTime);

  return (
    <Touchable
      style={{ backgroundColor: colors.background, margin: 10, padding: 10 }}
      touchType="none"
      onPress={onItemPress}
    >
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 1 }}>
          {toDateTime.diff(fromDateTime, "days")}日間
        </Text>
        <Text>
          {fromDateTime.format("YYYY年MM月DD日")}〜
          {toDateTime.format("MM月DD日")}まで
        </Text>
      </View>
      <Text style={{ color: colors.primary, fontSize: 20, paddingVertical: 5 }}>
        {reservation.space.name}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }} />
        <Text>{reservation.status}</Text>
      </View>
    </Touchable>
  );
};

export const ReservationScreen: React.FC<IReservationScreenProps> = ({
  coordinator,
}) => {
  const { colors, images, strings } = useResources();
  const [myReservations, reservations] = useUserReservation();

  const screenWidth = Dimensions.get("window").width;
  const [activeView, setActiveView] = useState<"hotel" | "space">("space");

  // animation properties
  const initialIndicatorX = useMemo(
    () => (activeView === "space" ? 0 : screenWidth / 2),
    [activeView]
  );
  const activeIndicatorX = useSharedValue(initialIndicatorX);
  const rIndicator = useAnimatedStyle(() => ({
    transform: [{ translateX: activeIndicatorX.value }],
  }));
  const showSpaceReservations = () => {
    "worklet";
    const toValue = 0;
    activeIndicatorX.value = withTiming(toValue, { duration: 350 });
    runOnJS(setActiveView)("space");
  };
  const showHotelReservations = () => {
    "worklet";
    const toValue = screenWidth / 2;
    activeIndicatorX.value = withTiming(toValue, { duration: 350 });
    runOnJS(setActiveView)("hotel");
  };

  const [{ accessToken }] = useState(SessionStore);

  const onRefresh = useCallback(async () => {
    await myReservations({});
  }, []);

  useEffect(() => {
    if (accessToken) myReservations({});
  }, [accessToken]);

  return (
    <View style={{ backgroundColor: colors.backgroundVariant, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 18,
          paddingHorizontal: 12,
          backgroundColor: colors.primary,
        }}
      >
        <SVGImage
          source={images.svg.calendar_days}
          color={colors.background}
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
        <Text
          style={{
            color: colors.background,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          予約 <Text style={{ fontWeight: "400" }}>(Reservation)</Text>
        </Text>
      </View>
      <View
        style={{ backgroundColor: colors.background, flexDirection: "row" }}
      >
        <Button
          containerStyle={{ flex: 1, borderColor: "transparent" }}
          onPress={() => showSpaceReservations()}
          title="Space"
        />
        <Button
          containerStyle={{ flex: 1, borderColor: "transparent" }}
          onPress={() => showHotelReservations()}
          title="Hotel"
        />
        <Animated.View
          style={[
            {
              backgroundColor: colors.primary,
              bottom: 0,
              height: 1.5,
              position: "absolute",
              width: "50%",
            },
            rIndicator,
          ]}
        />
      </View>
      {activeView === "hotel" ? (
        <FlatList
          ListEmptyComponent={EmptyHotelComponent}
          data={reservations.data?.myHotelRoomReservation.data}
          renderItem={({ item }) => (
            <HotelReservationItem
              coordinator={coordinator}
              reservation={item}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={reservations.loading}
              onRefresh={onRefresh}
            />
          }
        />
      ) : (
        <FlatList
          ListEmptyComponent={EmptySpaceComponent}
          data={reservations.data?.myReservations.data}
          renderItem={({ item }) => (
            <SpaceReservationItem
              coordinator={coordinator}
              reservation={item}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={reservations.loading}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};
