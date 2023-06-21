import React from "react";
import { Platform, StyleProp, View, ViewProps, ViewStyle } from "react-native";

export type ICardViewProps = ViewProps & {
  elevation?: number;
  style?:
    | StyleProp<
        Omit<
          ViewStyle,
          "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius"
        >
      >
    | undefined;
};

const CardView: React.FC<ICardViewProps> = (props) => {
  const { children, elevation, style, ...viewProps } = props;

  const elevationStyle = React.useMemo<ViewStyle | undefined>(() => {
    if (!elevation) return;
    if (Platform.OS === "ios") {
      return {
        shadowColor: "#000000",
        shadowOffset: { height: elevation * 0.25, width: 0 },
        shadowOpacity: elevation / 80,
      };
    }
    return { elevation };
  }, [elevation]);

  return (
    <View {...viewProps} style={[style, elevationStyle]}>
      {children}
    </View>
  );
};

export default CardView;
