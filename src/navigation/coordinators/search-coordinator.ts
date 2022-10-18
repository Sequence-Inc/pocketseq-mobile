import { SearchCoordinator as ISearchCoordinator } from "../../features/search";
import { IHotelScreenParams } from "../../features/hotel/screens";
import { ISpaceScreenParams } from "../../features/space/screens";
import { NavigationAction } from "../../features/search/search-coordinator";
import { StackActions } from "@react-navigation/native";

export class SearchCoordinator extends ISearchCoordinator {
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
  toHotelScreen(
    action: NavigationAction = "navigate",
    params: IHotelScreenParams | undefined
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
}
