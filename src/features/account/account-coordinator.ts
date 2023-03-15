import { NavigationProp, StackActions } from "@react-navigation/native";

export type NavigationAction = "replace" | "navigate";

export default abstract class AccountCoordinator {
  protected navigation: NavigationProp<any>;
  protected screenName: string;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  abstract toDashboardScreen(action?: NavigationAction): void;
  abstract toAuthScreen(action?: NavigationAction): void;

  goBack(): void {
    this.navigation.goBack();
  }

  toAccountPaymentMethodScreen(action: NavigationAction = "navigate") {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "account-payment-method-screen",
        })
      );
    else
      this.navigation.navigate(this.screenName, {
        screen: "account-payment-method-screen",
      });
  }

  toAccountSubscriptionScreen(action: NavigationAction = "navigate") {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "account-subscription-screen",
        })
      );
    else
      this.navigation.navigate(this.screenName, {
        screen: "account-subscription-screen",
      });
  }

  toAccountEditScreen(action: NavigationAction = "navigate") {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "account-edit-screen",
        })
      );
    else
      this.navigation.navigate(this.screenName, {
        screen: "account-edit-screen",
      });
  }
}
