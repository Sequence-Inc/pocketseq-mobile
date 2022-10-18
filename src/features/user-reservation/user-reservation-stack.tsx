import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import UserReservationCoordinator from "./user-reservation-coordinator";
import { UserReservationScreen } from "./screens";
import { useResources } from "../../resources";
import { HeaderLeftButton } from "../../widgets/header-left-button";

type UserReservationStackParamList = {
  "user-reservation-screen": undefined;
};

type UserReservationStackProps = {
  createCoordinator: () => UserReservationCoordinator;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<UserReservationStackParamList>();

export default function UserReservationStack({
  createCoordinator,
}: UserReservationStackProps) {
  const coordinator = createCoordinator();
  const { colors } = useResources();
  return (
    <Navigator
      initialRouteName="user-reservation-screen"
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
        <Screen name="user-reservation-screen">
          {(props) => (
            <UserReservationScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
      </Group>
    </Navigator>
  );
}
