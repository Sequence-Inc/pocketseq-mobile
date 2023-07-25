import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AccountCoordinator from "./account-coordinator";
import {
  AccountDetailScreen,
  AccountPaymentMethodScreen,
  AccountSubscriptionScreen,
  AccountEditScreen,
} from "./screens";
import { useResources } from "../../resources";
import { Profile } from "../../services/domains";
import { HeaderLeftButton } from "../../widgets/header-left-button";
import { AccountPasswordChangeScreen } from "./screens/account-password-change-screen";
import { AccountDeactivateScreen } from "./screens/account-account-deactivate";

type AccountStackParamList = {
  "account-detail-screen": undefined;
  "account-payment-method-screen": undefined;
  "account-subscription-screen": undefined;
  "account-edit-screen": undefined;
  "account-password-change-screen": undefined;
  "account-account-deactivate": undefined;
};

type AccountStackProps = {
  accountCoordinator: () => AccountCoordinator;
  profile?: Profile;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<AccountStackParamList>();

export default function AccountStack({
  accountCoordinator: accountCoordinator,
}: AccountStackProps) {
  const coordinator = accountCoordinator();
  const { colors } = useResources();
  return (
    <Navigator
      initialRouteName="account-detail-screen"
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
          title: "アカウント",
        }}
      >
        <Screen name="account-detail-screen">
          {(props) => (
            <AccountDetailScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen
          name="account-payment-method-screen"
          options={{
            title: "お支払方法",
          }}
        >
          {(props) => (
            <AccountPaymentMethodScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen
          name="account-subscription-screen"
          options={{
            title: "サブスクリプション",
          }}
        >
          {(props) => (
            <AccountSubscriptionScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen
          name="account-edit-screen"
          options={{
            title: "設定",
          }}
        >
          {(props) => (
            <AccountEditScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen
          name="account-password-change-screen"
          options={{
            title: "パスワードを変更",
          }}
        >
          {(props) => (
            <AccountPasswordChangeScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen
          name="account-account-deactivate"
          options={{
            title: "アカウントを削除",
          }}
        >
          {(props) => (
            <AccountDeactivateScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
      </Group>
    </Navigator>
  );
}
