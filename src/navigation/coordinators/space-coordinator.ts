import { SpaceCoordinator as ISpaceCoordinator } from "../../features/space";
import { NavigationAction } from "../../features/space/space-coordinator";
import { StackActions } from "@react-navigation/native";

export class SpaceCoordinator extends ISpaceCoordinator {
  toChatScreen(
    action: NavigationAction = "navigate",
    params?: { recipientId: string; recipientName: string } | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("chat-stack", params));
    else this.navigation.navigate("chat-stack", params);
  }
  toAuthScreen(action: NavigationAction = "navigate"): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("auth-stack"));
    else this.navigation.navigate("auth-stack");
  }
  toDashboardScreen(action: NavigationAction = "navigate"): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("dashboard-tab"));
    else this.navigation.navigate("dashboard-tab");
  }
  toReservationScreen(
    action: NavigationAction = "navigate",
    params: any
  ): void {
    console.log({ params });
    if (action === "replace") {
      // goes back to space screen
      this.navigation.dispatch(StackActions.popToTop());
      // then navigates to reservation screen
      this.navigation.navigate("user-reservation-stack", {
        screen: "user-reservation-screen",
        initial: true,
        params,
      });
    } else {
      this.navigation.navigate("user-reservation-stack", params);
    }
  }
}
