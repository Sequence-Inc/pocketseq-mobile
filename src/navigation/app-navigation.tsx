import React from "react";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStack, RootStackParamList } from "./root-stack";

const navigation = createNavigationContainerRef<RootStackParamList>();

const AppNavigation: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigation}>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigation;
