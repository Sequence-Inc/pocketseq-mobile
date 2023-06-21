import { View, Image, Text, Dimensions } from "react-native";
import React from "react";

import { observer } from "mobx-react";
import { useResources } from "../../../../resources";

import { styleStore } from "../../../../services/storage";
import { Touchable } from "../../../../widgets/touchable";

const { width } = Dimensions.get("window");

const bannerWidth = parseInt(`${(width - 12 * 3) / 2}`);
const bannerHeight = parseInt(`${bannerWidth / 2}`);

export type BannerPropTypes = {
  onPress: (val: string) => void;
};

const Banner = (props: BannerPropTypes) => {
  const { images, colors } = useResources();
  const [] = React.useState(() => styleStore);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ width: bannerWidth, marginRight: 12 }}>
        <Touchable onPress={() => props.onPress("rental-space")}>
          <View>
            <Image
              source={images.jpeg.sub_banner_space}
              style={{
                width: bannerWidth,
                height: bannerHeight,
                borderRadius: 6,
              }}
            />

            <Text
              style={{ fontSize: 12, marginTop: 12, color: colors.textVariant }}
            >
              スペースを定額制でご利用いただけます。アカウントプランでは、さらに多くの機能を利用できます。
            </Text>
          </View>
        </Touchable>
      </View>
      <View style={{ width: bannerWidth }}>
        <Touchable onPress={() => props.onPress("hotel")}>
          <View>
            <Image
              source={images.jpeg.sub_banner_hotel}
              style={{
                width: bannerWidth,
                height: bannerHeight,
                borderRadius: 6,
              }}
            />
            <Text
              style={{ fontSize: 12, marginTop: 12, color: colors.textVariant }}
            >
              宿泊を定額制でご利用いただけます。アカウントプランでは、さらに多くの機能を利用できます。
            </Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
};

export default observer(Banner);
