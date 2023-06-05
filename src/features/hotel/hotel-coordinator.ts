import { NavigationProp, StackActions } from "@react-navigation/native";

export type NavigationAction = "replace" | "navigate";

type TTO_HOTEL_RESERVAION_PROPS = {
  hotelId: string;
};

export type ReserveHotelParams = {
  startDate: string;
  endDate: string;
  noOfAdults: number | string;
  noOfChild: number | string;
  roomPlanId: string;
  room: any;
  plan: any;
  price: number;
  noOfNight: number | string;
};

export default abstract class HotelCoordinator {
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

  goBack(): void {
    this.navigation.goBack();
  }

  toHotelReservation(
    action: NavigationAction = "navigate",
    params: TTO_HOTEL_RESERVAION_PROPS
  ) {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "hotel-reservation",
          params,
        })
      );
    else
      this.navigation.dispatch(
        StackActions.push(this.screenName, {
          screen: "hotel-reservation",
          params,
        })
      );
  }
  toHotelReserveConfirm(
    action: NavigationAction = "navigate",
    params: ReserveHotelParams
  ) {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace(this.screenName, {
          screen: "confirm-hotel-reservation",
          params,
        })
      );
    else
      this.navigation.dispatch(
        StackActions.push(this.screenName, {
          screen: "confirm-hotel-reservation",
          params,
        })
      );
    // this.navigation.navigate(this.screenName, {
    //   screen: "confirm-hotel-reservation",
    // });
  }
  toPaymentMethodScreen() {
    this.navigation.navigate(this.screenName, {
      screen: "payment-method",
    });
  }
}
