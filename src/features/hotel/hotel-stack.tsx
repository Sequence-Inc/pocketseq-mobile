import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HotelCoordinator from "./hotel-coordinator";
import { HotelScreen, ConfirmReserve, HotelReservation } from "./screens";
import { useResources } from "../../resources";
import { HeaderLeftButton } from "../../widgets/header-left-button";

type HotelStackParamList = {
  "hotel-screen": undefined;
  "hotel-reservation": undefined;
  "confirm-hotel-reservation": undefined;
};

type HotelStackProps = {
  hotelCoordinator: () => HotelCoordinator;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<HotelStackParamList>();

export default function HotelStack({ hotelCoordinator }: HotelStackProps) {
  const coordinator = hotelCoordinator();
  const { colors } = useResources();
  return (
    <Navigator
      initialRouteName="hotel-screen"
      screenOptions={{
        headerBackTitleVisible: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTitleAlign: "center",
        headerTitleStyle: { color: colors.background },
        headerLeft: (props) => {
          return (
            <HeaderLeftButton
              headerButtonProps={props}
              coordinator={coordinator}
            />
          );
        },
      }}
    >
      <Group
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          title: "宿泊スペース",
        }}
      >
        <Screen name="hotel-screen">
          {(props) => <HotelScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="hotel-reservation">
          {(props) => <HotelReservation {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="confirm-hotel-reservation">
          {(props) => <ConfirmReserve {...props} coordinator={coordinator} />}
        </Screen>
      </Group>
    </Navigator>
  );
}
