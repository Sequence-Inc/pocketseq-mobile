import { NavigationProp, StackActions } from "@react-navigation/native";

export type NavigationAction = "replace" | "navigate";

export type ResetPasswordScreenParams = {
  email: string;
  code: string;
};
export default abstract class AuthCoordinator {
  protected navigation: NavigationProp<any>;
  protected screenName: string;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  abstract toDashboardScreen(action?: NavigationAction): void;

  toAccountVerificationScreen(action: NavigationAction = "navigate", email: string | undefined) {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, { screen: "account-verification-screen", params: { email } })
      );
    else this.navigation.navigate(this.screenName, { screen: "account-verification-screen" });
  }
  toForgotPasswordScreen(action: NavigationAction = "navigate") {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace(this.screenName, { screen: "forgot-password-screen" }));
    else this.navigation.navigate(this.screenName, { screen: "forgot-password-screen" });
  }
  toForgotPasswordVerificationScreen(action: NavigationAction = "navigate", email: string | undefined) {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, { screen: "forgot-password-verification-screen", params: { email } })
      );
    else this.navigation.navigate(this.screenName, { screen: "forgot-password-verification-screen" });
  }
  toLoginScreen(action: NavigationAction = "navigate") {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace(this.screenName, { screen: "login-screen" }));
    else this.navigation.navigate(this.screenName, { screen: "login-screen" });
  }
  toResetPasswordScreen(action: NavigationAction = "navigate", params: ResetPasswordScreenParams) {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace(this.screenName, { screen: "reset-password-screen", params }));
    else this.navigation.navigate(this.screenName, { screen: "reset-password-screen" });
  }
  toSignupScreen(action: NavigationAction = "navigate") {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace(this.screenName, { screen: "signup-screen" }));
    else this.navigation.navigate(this.screenName, { screen: "signup-screen" });
  }

  goBack(): void {
    this.navigation.goBack();
  }
}
