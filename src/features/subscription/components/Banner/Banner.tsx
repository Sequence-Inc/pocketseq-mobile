import { View, Text, Dimensions } from "react-native";
import React from "react";

import { observer } from "mobx-react";
import { useResources } from "../../../../resources";

import { styleStore } from "../../../../services/storage";
import { CardView } from "../../../../widgets/card-view";
import { Touchable } from "../../../../widgets/touchable";

const { width, height } = Dimensions.get("window");

export type BannerPropTypes = {
  onPress: (val: string) => void;
};

const Banner = (props: BannerPropTypes) => {
  const { colors } = useResources();
  const [{ globalStyles }] = React.useState(() => styleStore);

  return (
    <View
      style={[
        globalStyles.row,
        {
          width: "100%",
          justifyContent: "space-between",
        },
      ]}
    >
      <Touchable onPress={() => props.onPress("rental-space")}>
        <CardView
          elevation={2}
          style={[
            {
              borderWidth: 1,
              borderRadius: 7,
              borderColor: `rgba(210,220,220,0.2)`,
              width: (width - 8 * 5) / 2,
              padding: 8,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              backgroundColor: "rgba(255,255,255,0.9)",
            },
          ]}
        >
          <Text
            style={{
              width: "100%",
              color: colors.primaryVariant,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Space subscriptions
          </Text>

          <Text>See Subscription plans for Hotels</Text>
        </CardView>
      </Touchable>
      <Touchable onPress={() => props.onPress("hotel")}>
        <CardView
          elevation={2}
          style={[
            {
              borderWidth: 1,
              borderRadius: 7,
              borderColor: `rgba(210,220,220,0.2)`,
              width: (width - 8 * 5) / 2,
              padding: 8,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              backgroundColor: "rgba(255,255,255,0.9)",
            },
          ]}
        >
          <Text
            style={{
              width: "100%",
              color: colors.primaryVariant,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Hotel subscriptions
          </Text>
          <Text style={{ width: "100%" }}>
            See subscription plans for Hotels
          </Text>
        </CardView>
      </Touchable>
    </View>
  );
};

export default observer(Banner);
