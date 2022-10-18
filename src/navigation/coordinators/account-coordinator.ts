import { AccountCoordinator as IAccountCoordinator } from "../../features/account";
import { NavigationAction } from "../../features/account/account-coordinator";
import { StackActions } from "@react-navigation/native";

export class AccountCoordinator extends IAccountCoordinator {
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
