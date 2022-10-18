import { NavigationProp } from "@react-navigation/native";

export type NavigationAction = "replace" | "navigate";

export default abstract class UserReservationCoordinator {
  protected navigation: NavigationProp<any>;
  protected screenName: string;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  abstract toDashboardScreen(action?: NavigationAction): void;
  abstract toAuthScreen(action?: NavigationAction): void;

  goBack(): void {
    this.navigation.goBack();
  }
}
