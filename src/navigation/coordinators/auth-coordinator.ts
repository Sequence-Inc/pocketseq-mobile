import { AuthCoordinator as IAuthCoordinator } from "../../features/auth";
import { NavigationAction } from "../../features/auth/auth-coordinator";
import { StackActions } from "@react-navigation/native";

export class AuthCoordinator extends IAuthCoordinator {
  toDashboardScreen(action: NavigationAction = "navigate"): void {
    if (action === "replace")
      this.navigation.dispatch(StackActions.replace("dashboard-tab"));
    else this.navigation.navigate("dashboard-tab");
  }
}
