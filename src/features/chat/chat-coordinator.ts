import { NavigationProp } from "@react-navigation/native";

export default abstract class ChatCoordinator {
  protected navigation: NavigationProp<any>;
  protected screenName: string;

  constructor(screenName: string, navigation: any) {
    this.screenName = screenName;
    this.navigation = navigation;
  }

  goBack(): void {
    this.navigation.goBack();
  }
}
