import { NavigationProp, StackActions } from "@react-navigation/native";
import { Moment } from "moment";

export type NavigationAction = "replace" | "navigate";

export type TTO_SUBSCRIPTION_PROPS = {
  subscriptionType: string;
};

export type TTOCONFIRM__SPACE_RESERVAION_PROPS = {
  fromDateTime: number | undefined | Moment;
  duration: number;
  spaceId: string;
  durationType: string;
};
export abstract class SubscriptionCoordinator {
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

  toSubscription(action: NavigationAction = "navigate", params: TTO_SUBSCRIPTION_PROPS) {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace(this.screenName, { screen: "subscriptions-screen", params }));
    else this.navigation.navigate(this.screenName, { screen: "subscriptions-screen" });
  }
}
