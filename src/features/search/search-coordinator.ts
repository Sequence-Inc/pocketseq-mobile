import { IHotelScreenParams } from "../../features/hotel/screens";
import { ISpaceScreenParams } from "../../features/space/screens";
import {
  SpaceSearchFilterOptions,
  HotelSearchFilterOptions,
} from "./search-helpers";

export type NavigationAction = "replace" | "navigate";

export default abstract class SearchCoordinator {
  protected navigation: any;
  protected screenName: string;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  abstract toDashboardScreen(action?: NavigationAction): void;
  abstract toAuthScreen(action?: NavigationAction): void;
  abstract toSpaceScreen(
    action?: NavigationAction,
    params?: ISpaceScreenParams
  ): void;
  abstract toHotelScreen(
    action?: NavigationAction,
    params?: IHotelScreenParams
  ): void;

  goBack(): void {
    this.navigation.goBack();
  }

  toSearchResultScreen(
    params: SpaceSearchFilterOptions & HotelSearchFilterOptions
  ) {
    this.navigation.push(this.screenName, {
      screen: "search-result-screen",
      params,
    });
  }
}
