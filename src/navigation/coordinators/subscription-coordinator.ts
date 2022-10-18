import { SubscriptionCoordinator as ISubscriptionCoordinator } from "../../features/subscription";
import { NavigationAction } from "../../features/account/account-coordinator";
import { StackActions } from "@react-navigation/native";

export class AllSubscriptionCoordinator extends ISubscriptionCoordinator {
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
}
