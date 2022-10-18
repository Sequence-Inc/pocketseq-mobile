import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { ActivityIndicator } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useResources } from "../../resources";

export type IFullScreenActivityIndicatorProps = {
  loading?: boolean;
};

const FullScreenActivityIndicator: React.FC<
  IFullScreenActivityIndicatorProps
> = (props) => {
  const headerHeight = useHeaderHeight();
  const { colors } = useResources();

  const loading = props?.loading || true;

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        paddingTop: headerHeight,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator animating={loading} />
    </SafeAreaView>
  );
};

export default FullScreenActivityIndicator;
