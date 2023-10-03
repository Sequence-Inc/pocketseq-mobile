import { NavigationProp, StackActions } from "@react-navigation/native";
import { Moment } from "moment";

export type NavigationAction = "replace" | "navigate";

export type TTO_SPACE_RESERVAION_PROPS = {
  spaceId: string;
};

export type TTOCONFIRM__SPACE_RESERVAION_PROPS = {
  fromDateTime: number | undefined | Moment;
  duration: number;
  spaceId: string;
  durationType: string;
};
export default abstract class SpaceCoordinator {
  protected navigation: NavigationProp<any>;
  protected screenName: string;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  abstract toDashboardScreen(action?: NavigationAction): void;
  abstract toAuthScreen(action?: NavigationAction): void;
  abstract toChatScreen(
    action?: NavigationAction,
    params?: { recipientId: string; recipientName: string }
  ): void;
  abstract toReservationScreen(
    action?: NavigationAction,
    params?: { type: string; data: any }
  ): void;

  goBack(): void {
    this.navigation.goBack();
  }

  toSpaceReservation(
    action: NavigationAction = "navigate",
    params: TTO_SPACE_RESERVAION_PROPS
  ) {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "space-reservation",
          params,
        })
      );
    else {
      this.navigation.dispatch(
        StackActions.push(this.screenName, {
          screen: "space-reservation",
          params,
        })
      );
    }
  }

  toSpaceReserveConfirm(
    action: NavigationAction = "navigate",
    params: TTOCONFIRM__SPACE_RESERVAION_PROPS
  ) {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "confirm-space-reservation",
          params,
        })
      );
    else
      this.navigation.dispatch(
        StackActions.push(this.screenName, {
          screen: "confirm-space-reservation",
          params,
        })
      );
  }
  toPaymentMethodScreen() {
    this.navigation.navigate(this.screenName, {
      screen: "payment-method",
    });
  }
}
