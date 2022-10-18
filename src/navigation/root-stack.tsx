import React from "react";
import { AuthStack } from "../features/auth";
import { DashboardTab } from "../features/dashboard";
import { SpaceStack } from "../features/space";
import { HotelStack } from "../features/hotel";
import { SearchStack } from "../features/search";
import { AccountStack } from "../features/account";
import { ChatStack } from "../features/chat";
import { SubscriptionStack } from "../features/subscription";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AuthCoordinator,
  DashboardCoordinator,
  SpaceCoordinator,
  HotelCoordinator,
  SearchCoordinator,
  AccountCoordinator,
  AllSubscriptionCoordinator,
  ChatCoordinator,
} from "./coordinators";
import { UserReservationStack } from "../features/user-reservation";
import { UserReservationCoordinator } from "./coordinators/user-reservation-coordinator";

export type RootStackParamList = {
  "auth-stack": undefined;
  "dashboard-tab": undefined;
  "space-stack": undefined;
  "hotel-stack": undefined;
  "search-stack": undefined;
  "account-stack": undefined;
  "subscription-stack": undefined;
  "user-reservation-stack": undefined;
  "chat-stack": undefined;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC = () => {
  return (
    <Navigator
      initialRouteName="dashboard-tab"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: "left",
      }}
    >
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="auth-stack">
          {(props) => (
            <AuthStack
              {...props}
              authCoordinator={() =>
                new AuthCoordinator("auth-stack", props.navigation)
              }
            />
          )}
        </Screen>
        <Screen name="dashboard-tab">
          {(props) => (
            <DashboardTab
              {...props}
              dashboardCoordinator={() =>
                new DashboardCoordinator("dashboar-stack", props.navigation)
              }
            />
          )}
        </Screen>
        <Screen name="space-stack">
          {(props) => (
            <SpaceStack
              {...props}
              spaceCoordinator={() =>
                new SpaceCoordinator("space-stack", props.navigation)
              }
            />
          )}
        </Screen>
        <Screen name="hotel-stack">
          {(props) => (
            <HotelStack
              {...props}
              hotelCoordinator={() =>
                new HotelCoordinator("hotel-stack", props.navigation)
              }
            />
          )}
        </Screen>
        <Screen name="search-stack">
          {(props) => (
            <SearchStack
              {...props}
              searchCoordinator={() =>
                new SearchCoordinator("search-stack", props.navigation)
              }
            />
          )}
        </Screen>
        <Screen name="account-stack">
          {(props) => (
            <AccountStack
              {...props}
              accountCoordinator={() =>
                new AccountCoordinator("account-stack", props.navigation)
              }
            />
          )}
        </Screen>

        <Screen name="subscription-stack">
          {(props) => (
            <SubscriptionStack
              {...props}
              subscriptionCoordinator={() =>
                new AllSubscriptionCoordinator(
                  "subscription-stack",
                  props.navigation
                )
              }
            />
          )}
        </Screen>

        <Screen name="user-reservation-stack">
          {(props) => (
            <UserReservationStack
              {...props}
              createCoordinator={() =>
                new UserReservationCoordinator(
                  "user-reservation-stack",
                  props.navigation
                )
              }
            />
          )}
        </Screen>

        <Screen name="chat-stack">
          {(props) => (
            <ChatStack
              {...props}
              chatCoordinator={() =>
                new ChatCoordinator("chat-stack", props.navigation)
              }
            />
          )}
        </Screen>
      </Group>
    </Navigator>
  );
};
