import {
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { SVGImage } from "../../widgets/svg-image";
import { Touchable } from "../../widgets/touchable";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../resources";
import DashboardCoordinator from "./dashboard-coordinator";
import {
  AccountScreen,
  HomeScreen,
  MessagesScreen,
  ReservationScreen,
} from "./screens";

import { SearchMapScreen } from "../search/screens";

export type IDashboardTabProps = {
  dashboardCoordinator: () => DashboardCoordinator;
};

const { width } = Dimensions.get("screen");

type ParamList = {
  "account-screen": undefined;
  "home-screen": undefined;
  "messages-screen": undefined;
  "reservation-screen": undefined;
  "search-map-screen": undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<ParamList>();

export default function DashboardTab({
  dashboardCoordinator,
}: IDashboardTabProps) {
  const coordinator = dashboardCoordinator();
  const { colors, images } = useResources();

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
      <Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.background,
          tabBarInactiveTintColor: colors.backgroundVariant,
          tabBarItemStyle: { paddingVertical: 10, height: 56 },
          tabBarStyle: { height: 56, backgroundColor: colors.primary },
          tabBarHideOnKeyboard: false,
        }}
      >
        <Screen
          name="home-screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <SVGImage
                style={{ width: size, height: size, marginBottom: 4 }}
                color={color}
                source={images.svg.ic_home}
              />
            ),
            title: "ホーム",
            header: (props) => (
              <HomeHeader coordinator={coordinator} {...props} />
            ),
            headerShown: true,
          }}
        >
          {(props) => <HomeScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen
          name="search-map-screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <SVGImage
                style={{ width: size, height: size, marginBottom: 4 }}
                color={color}
                source={images.svg.map_pin}
              />
            ),
            title: "現在地から探す",
          }}
        >
          {(props) => (
            <SearchMapScreen {...props} coordinator={coordinator} isTabScreen />
          )}
        </Screen>
        <Screen
          name="reservation-screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <SVGImage
                style={{ width: size, height: size, marginBottom: 4 }}
                color={color}
                source={images.svg.calendar_days}
              />
            ),
            title: "予約",
          }}
        >
          {(props) => (
            <ReservationScreen {...props} coordinator={coordinator} />
          )}
        </Screen>
        <Screen
          name="messages-screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <SVGImage
                style={{ width: size, height: size, marginBottom: 4 }}
                color={color}
                source={images.svg.ic_chat}
              />
            ),
            title: "メッセージ",
          }}
        >
          {(props) => <MessagesScreen {...props} coordinator={coordinator} />}
        </Screen>
        <Screen
          name="account-screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <SVGImage
                style={{ width: size, height: size, marginBottom: 4 }}
                color={color}
                source={images.svg.ic_account}
              />
            ),
            title: "アカウント",
          }}
        >
          {(props) => <AccountScreen {...props} coordinator={coordinator} />}
        </Screen>
      </Navigator>
    </SafeAreaView>
  );
}

const HomeHeader = ({
  coordinator,
  options,
}: BottomTabHeaderProps & { coordinator: DashboardCoordinator }) => {
  const { colors, images } = useResources();

  return (
    <View
      style={[
        options.headerStyle,
        {
          backgroundColor: colors.primary,
          paddingHorizontal: 12,
          paddingBottom: 12,
        },
      ]}
    >
      <SVGImage
        style={{ aspectRatio: 3.8, width: "50%", marginBottom: 12 }}
        source={images.svg.logo}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Touchable
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            borderRadius: 100,
            width: "45%",
          }}
          onPress={() => {
            coordinator.toSearchScreen("navigate", { searchType: "SPACE" });
          }}
        >
          <Text
            style={{
              color: colors.textVariant,
              opacity: 0.7,
              fontSize: 16,
              fontWeight: "bold",
              paddingVertical: 12,
              textAlign: "center",
            }}
          >
            スペース検索
          </Text>
        </Touchable>
        <Touchable
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            borderRadius: 100,
            width: "45%",
          }}
          onPress={() => {
            coordinator.toSearchScreen("navigate", { searchType: "HOTEL" });
          }}
        >
          <Text
            style={{
              color: colors.textVariant,
              opacity: 0.7,
              fontSize: 16,
              fontWeight: "bold",
              paddingVertical: 12,
              textAlign: "center",
            }}
          >
            宿泊検索
          </Text>
        </Touchable>
      </View>
    </View>
  );
};
