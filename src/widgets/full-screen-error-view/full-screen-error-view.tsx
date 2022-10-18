import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { useResources } from "../../resources";
import { SafeAreaViewProps } from "react-native-safe-area-context";

export type IFullScreenErrorViewProps = SafeAreaViewProps;

const FullScreenErrorView: React.FC<IFullScreenErrorViewProps> = (props) => {
  const { edges, style, children, ...safeAreaViewProps } = props;
  const headerHeight = useHeaderHeight();
  const { colors } = useResources();

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: colors.background,
          paddingTop: headerHeight,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...safeAreaViewProps}
    >
      {children}
    </SafeAreaView>
  );
};

export default FullScreenErrorView;
