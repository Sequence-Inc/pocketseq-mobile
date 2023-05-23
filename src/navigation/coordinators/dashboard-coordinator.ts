import { IAccountDetailScreenParams } from "../../features/account/screens";
import { DashboardCoordinator as IDashboardCoordinator } from "../../features/dashboard";
import { NavigationAction } from "../../features/dashboard/dashboard-coordinator";
import {
  ISearchScreenParams,
  HotelSearchFilterOptions,
  SpaceSearchFilterOptions,
} from "../../features/search/search-helpers";
import { ISpaceScreenParams } from "../../features/space/screens";
import { StackActions } from "@react-navigation/native";
import { ChatObject } from "../../services/domains";

export class DashboardCoordinator extends IDashboardCoordinator {
  toAuthScreen(action: NavigationAction = "navigate"): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("auth-stack"));
    else this.navigation.navigate("auth-stack");
  }

  toSpaceScreen(
    action: NavigationAction = "navigate",
    params: ISpaceScreenParams | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("space-stack", { params, screen: "space-screen" })
      );
    else
      this.navigation.navigate("space-stack", {
        params,
        screen: "space-screen",
      });
  }
  toSubscriptionsScreen(
    action: NavigationAction = "navigate",
    params?: any
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("subscription-stack", {
          params,
          screen: "subscriptions-screen",
        })
      );
    else
      this.navigation.navigate("subscription-stack", {
        params,
        screen: "subscriptions-screen",
      });
  }

  toHotelScreen(
    action: NavigationAction = "navigate",
    params: ISpaceScreenParams | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("hotel-stack", { params, screen: "hotel-screen" })
      );
    else
      this.navigation.navigate("hotel-stack", {
        params,
        screen: "hotel-screen",
      });
  }

  toSearchScreen(
    action: NavigationAction = "navigate",
    params: ISearchScreenParams | undefined
  ): void {
    console.log("Go to search screen");
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("search-stack", {
          params,
          screen: "search-screen",
        })
      );
    else
      this.navigation.navigate("search-stack", {
        params,
        screen: "search-screen",
      });
  }

  toSearchResultScreen(
    action: NavigationAction = "navigate",
    params: (HotelSearchFilterOptions & SpaceSearchFilterOptions) | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("search-stack", {
          params,
          screen: "search-result-screen",
        })
      );
    else
      this.navigation.navigate("search-stack", {
        params,
        screen: "search-result-screen",
      });
  }

  toSearchMapScreen(
    action: NavigationAction = "navigate",
    params: (HotelSearchFilterOptions & SpaceSearchFilterOptions) | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("search-stack", {
          params,
          screen: "search-map-screen",
        })
      );
    else
      this.navigation.navigate("search-stack", {
        params,
        screen: "search-map-screen",
      });
  }

  toAccountDetailScreen(
    action: NavigationAction = "navigate",
    params: IAccountDetailScreenParams
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("account-stack", {
          params,
          screen: "account-detail-screen",
        })
      );
    else
      this.navigation.navigate("account-stack", {
        params,
        screen: "account-detail-screen",
      });
  }
  toAccountPaymentMethodScreen(
    action: NavigationAction = "navigate",
    params?: void
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("account-stack", {
          params,
          screen: "account-payment-method-screen",
        })
      );
    else
      this.navigation.navigate("account-stack", {
        params,
        screen: "account-payment-method-screen",
      });
  }

  toAccountSubscriptionScreen(
    action: NavigationAction = "navigate",
    params?: void
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("account-stack", {
          params,
          screen: "account-subscription-screen",
        })
      );
    else
      this.navigation.navigate("account-stack", {
        params,
        screen: "account-subscription-screen",
      });
  }
  toAccountEditScreen(
    action: NavigationAction = "navigate",
    params?: void
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("account-stack", {
          params,
          screen: "account-edit-screen",
        })
      );
    else
      this.navigation.navigate("account-stack", {
        params,
        screen: "account-edit-screen",
      });
  }
  toAccountPasswordChangeScreen(
    action: NavigationAction = "navigate",
    params?: void
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("account-stack", {
          params,
          screen: "account-password-change-screen",
        })
      );
    else
      this.navigation.navigate("account-stack", {
        params,
        screen: "account-password-change-screen",
      });
  }

  toUserReservationScreen(
    action?: NavigationAction | undefined,
    params?: any
  ): void {
    if (action === "replace")
      this.navigation.dispatch(
        StackActions.replace("user-reservation-stack", {
          params,
          screen: "user-reservation-screen",
        })
      );
    else
      this.navigation.navigate("user-reservation-stack", {
        params,
        screen: "user-reservation-screen",
      });
  }

  toChatScreen(
    action?: NavigationAction | undefined,
    params?: { chatObject: ChatObject } | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("chat-stack", params));
    else this.navigation.navigate("chat-stack", params);
  }
}
