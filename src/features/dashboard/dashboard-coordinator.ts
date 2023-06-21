import { NavigationProp, TabActions } from "@react-navigation/native";
import { ChatObject } from "../../services/domains";

export type NavigationAction = "replace" | "navigate";

export default abstract class DashboardCoordinator {
  private screenName: string;
  protected navigation: NavigationProp<any>;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  abstract toAuthScreen(action?: NavigationAction, params?: any): void;
  abstract toSpaceScreen(action?: NavigationAction, params?: any): void;
  abstract toHotelScreen(action?: NavigationAction, params?: any): void;
  abstract toSearchScreen(action?: NavigationAction, params?: any): void;
  abstract toSearchResultScreen(action?: NavigationAction, params?: any): void;
  abstract toSearchMapScreen(action?: NavigationAction, params?: any): void;
  abstract toAccountDetailScreen(action?: NavigationAction, params?: any): void;
  abstract toAccountPaymentMethodScreen(
    action?: NavigationAction,
    params?: any
  ): void;
  abstract toAccountSubscriptionScreen(
    action?: NavigationAction,
    params?: any
  ): void;
  abstract toAccountEditScreen(action?: NavigationAction, params?: any): void;
  abstract toAccountPasswordChangeScreen(
    action?: NavigationAction,
    params?: any
  ): void;
  abstract toSubscriptionsScreen(action?: NavigationAction, params?: any): void;
  abstract toUserReservationScreen(
    action?: NavigationAction,
    params?: any
  ): void;
  abstract toChatScreen(
    action?: NavigationAction,
    params?: { chatObject: ChatObject }
  ): void;

  toDashboardScreen() {
    this.navigation.dispatch(
      TabActions.jumpTo(this.screenName, { screen: "home-screen" })
    );
  }

  toHomeScreen() {
    this.navigation.dispatch(
      TabActions.jumpTo(this.screenName, { screen: "home-screen" })
    );
  }
  toMessageScreen() {
    this.navigation.dispatch(
      TabActions.jumpTo(this.screenName, { screen: "messages-screen" })
    );
  }
  toNotificationScreen() {
    this.navigation.dispatch(
      TabActions.jumpTo(this.screenName, { screen: "notification-screen" })
    );
  }
  toAccountScreen() {
    this.navigation.dispatch(
      TabActions.jumpTo(this.screenName, { screen: "account-screen" })
    );
  }

  goBack(): void {
    this.navigation.goBack();
  }
}
