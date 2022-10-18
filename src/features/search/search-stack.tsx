import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SearchCoordinator from "./search-coordinator";
import { SearchMapScreen, SearchScreen } from "./screens";
import { useResources } from "../../resources";
import { HeaderLeftButton } from "../../widgets/header-left-button";
import { SearchResultScreen } from "./screens/search-result-screen";

type SearchStackParamList = {
  "search-screen": undefined;
  "search-result-screen": undefined;
  "search-map-screen": undefined;
};

type SearchStackProps = {
  searchCoordinator: () => SearchCoordinator;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack({
  searchCoordinator: searchCoordinator,
}: SearchStackProps) {
  const coordinator = searchCoordinator();
  const { colors } = useResources();
  return (
    <Navigator
      initialRouteName="search-screen"
      screenOptions={{
        headerBackTitleVisible: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTitleAlign: "center",
        headerTitleStyle: { color: colors.background },
        headerLeft: (props) => {
          return (
            <HeaderLeftButton
              headerButtonProps={props}
              coordinator={coordinator}
            />
          );
        },
      }}
    >
      <Group
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          title: "検索",
        }}
      >
        <Screen name="search-screen">
          {(props) => <SearchScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen name="search-result-screen">
          {(props) => (
            <SearchResultScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen name="search-map-screen">
          {(props) => <SearchMapScreen {...props} coordinator={coordinator} />}
        </Screen>
      </Group>
    </Navigator>
  );
}
