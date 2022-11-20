import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SubscriptionCoordinator } from "./subscription-coordinator";
import { Subscription } from "./screens";
import { useResources } from "../../resources";
import { HeaderLeftButton } from "../../widgets/header-left-button";

type SubscriptionStackParamList = {
  "subscriptions-screen": undefined;
};

type SubscriptionStackProps = {
  subscriptionCoordinator: () => SubscriptionCoordinator;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<SubscriptionStackParamList>();

export default function SubscriptionStack({
  subscriptionCoordinator: subscriptionCoordinator,
}: SubscriptionStackProps) {
  const coordinator = subscriptionCoordinator();
  const { colors } = useResources();

  return (
    <Navigator
      initialRouteName="subscriptions-screen"
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
          title: "サブスクリプション",
        }}
      >
        <Screen name="subscriptions-screen">
          {(props) => <Subscription {...props} coordinator={coordinator} />}
        </Screen>
      </Group>
    </Navigator>
  );
}
