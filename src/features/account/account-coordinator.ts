import { NavigationProp } from "@react-navigation/native";
import { IAccountPaymentMethodScreenParams } from "./screens";

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

  toAccountPaymentMethodScreen(params: IAccountPaymentMethodScreenParams) {
    this.navigation.push(this.screenName, { screen: "account-payment-method-screen", params });
  }
}
