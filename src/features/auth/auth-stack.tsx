import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthCoordinator from "./auth-coordinator";
import {
  AccountVerificationScreen,
  ForgotPasswordScreen,
  ForgotPasswordVerificationScreen,
  LoginScreen,
  ResetPasswordScreen,
  SignupScreen,
} from "./screens";

type AuthStackParamList = {
  "account-verification-screen": undefined;
  "forgot-password-screen": undefined;
  "forgot-password-verification-screen": undefined;
  "login-screen": undefined;
  "reset-password-screen": undefined;
  "signup-screen": undefined;
};

type AuthStackProps = {
  authCoordinator: () => AuthCoordinator;
};

const { Group, Navigator, Screen } = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack({ authCoordinator }: AuthStackProps) {
  const coordinator = authCoordinator();
  return (
    <Navigator
      initialRouteName="login-screen"
      screenOptions={{ headerBackTitleVisible: false, headerTitleAlign: "center" }}
    >
      <Group screenOptions={{ headerShown: true, headerTransparent: true, title: "" }}>
        <Screen name="account-verification-screen">
          {(props) => <AccountVerificationScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="forgot-password-verification-screen">
          {(props) => <ForgotPasswordVerificationScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="forgot-password-screen">
          {(props) => <ForgotPasswordScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="login-screen">{(props) => <LoginScreen {...props} coordinator={coordinator} />}</Screen>
        <Screen name="reset-password-screen">
          {(props) => <ResetPasswordScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="signup-screen">{(props) => <SignupScreen {...props} coordinator={coordinator} />}</Screen>
      </Group>
    </Navigator>
  );
}
