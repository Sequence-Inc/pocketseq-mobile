import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SpaceCoordinator from "./space-coordinator";
import {
  SpaceScreen,
  SpaceReservationScreen,
  SpaceReservationConfirmation,
} from "./screens";
import { useResources } from "../../resources";
import { HeaderLeftButton } from "../../widgets/header-left-button";
import { AccountPaymentMethodScreen } from "../account/screens";

type SpaceStackParamList = {
  "space-screen": undefined;
  "space-reservation": undefined;
  "confirm-space-reservation": undefined;
  "payment-method": undefined;
};

type SpaceStackProps = {
  spaceCoordinator: () => SpaceCoordinator;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<SpaceStackParamList>();

export default function SpaceStack({
  spaceCoordinator: spaceCoordinator,
}: SpaceStackProps) {
  const coordinator = spaceCoordinator();
  const { colors } = useResources();
  return (
    <Navigator
      initialRouteName="space-screen"
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
          title: "レンタルスペース",
        }}
      >
        <Screen name="space-screen">
          {(props) => <SpaceScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="space-reservation">
          {(props) => (
            <SpaceReservationScreen {...props} coordinator={coordinator} />
          )}
        </Screen>

        <Screen name="confirm-space-reservation">
          {(props) => (
            <SpaceReservationConfirmation
              {...props}
              coordinator={coordinator}
            />
          )}
        </Screen>
        <Screen
          name="payment-method"
          options={{
            presentation: "modal",
            headerLeft: () => null,
            title: "お支払い方法管理",
          }}
        >
          {(props) => (
            <AccountPaymentMethodScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
      </Group>
    </Navigator>
  );
}
