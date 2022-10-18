import { HotelCoordinator as IHotelCoordinator } from "../../features/hotel";
import { NavigationAction } from "../../features/space/space-coordinator";
import { StackActions } from "@react-navigation/native";

export class HotelCoordinator extends IHotelCoordinator {
  toAuthScreen(action: NavigationAction = "navigate"): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("auth-stack"));
    else this.navigation.navigate("auth-stack");
  }
  toChatScreen(
    action: NavigationAction = "navigate",
    params?: { recipientId: string; recipientName: string } | undefined
  ): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("chat-stack", params));
    else this.navigation.navigate("chat-stack", params);
  }

  toDashboardScreen(action: NavigationAction = "navigate"): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("dashboard-tab"));
    else this.navigation.navigate("dashboard-tab");
  }
}
