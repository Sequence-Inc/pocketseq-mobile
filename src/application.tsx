import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlgoliaProvider } from "./services/algolia";
import { AppCache, AppClient, AppClientProvider } from "./services/graphql";
import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "./navigation";
import React from "react";
import { ResourcesProvider } from "./resources";
import { AuthContextProvider } from "./contexts/auth";
import { Subscription } from "expo-modules-core";
import { Notification } from "expo-notifications";
import { registerNotifications } from "./utils/notification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function Application() {
  const algoliaApiKey = "6c2c5bb09c6f0da1002a51d1995969bd";
  const algoliaAppId = "K2PIS0458U";

  const apiUri = "https://dev-api.pocketseq.com/dev/graphql";
  const appCache = new AppCache({ storage: AsyncStorage });
  const appClient = new AppClient({ cache: appCache, uri: apiUri });

  const [expoPushToken, setExpoPushToken] = React.useState<
    string | undefined
  >();
  const [notification, setNotification] = React.useState<Notification>();
  const notificationListener = React.useRef<Subscription>();
  const responseListener = React.useRef<Subscription>();

  React.useEffect(() => {
    registerNotifications().then((token) => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <AppClientProvider client={appClient}>
      <AlgoliaProvider apiKey={algoliaApiKey} appId={algoliaAppId}>
        <ResourcesProvider language="en">
          <StatusBar style="light" />
          <AuthContextProvider>
            <AppNavigation />
          </AuthContextProvider>
        </ResourcesProvider>
      </AlgoliaProvider>
    </AppClientProvider>
  );
}
