import { UserReservationCoordinator as IUserReservationCoordinator } from "../../features/user-reservation";
import { NavigationAction } from "../../features/space/space-coordinator";
import { StackActions } from "@react-navigation/native";

export class UserReservationCoordinator extends IUserReservationCoordinator {
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
