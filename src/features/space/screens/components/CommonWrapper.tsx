import { View } from "react-native";
import React from "react";
import { useResources } from "../../../../resources";

export const CommonWrapper = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { colors } = useResources();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 18,
      }}
    >
      {children}
    </View>
  );
};
