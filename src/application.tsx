import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlgoliaProvider } from "./services/algolia";
import { AppCache, AppClient, AppClientProvider } from "./services/graphql";
import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "./navigation";
import React from "react";
import { ResourcesProvider } from "./resources";
import { AuthContextProvider } from "./contexts/auth";

export function Application() {
  const algoliaApiKey = "6c2c5bb09c6f0da1002a51d1995969bd";
  const algoliaAppId = "K2PIS0458U";

  const apiUri = "https://dev-api.pocketseq.com/dev/graphql";
  const appCache = new AppCache({ storage: AsyncStorage });
  const appClient = new AppClient({ cache: appCache, uri: apiUri });

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
