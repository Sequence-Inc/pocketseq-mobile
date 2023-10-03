import React from "react";
import { useResources } from "../../resources";
import { Touchable } from "../touchable";
import { SVGImage } from "../svg-image";
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";

export type IHeaderLeftButtonProps = {
  headerButtonProps: HeaderButtonProps;
  coordinator: any;
};

const HeaderLeftButton: React.FC<IHeaderLeftButtonProps> = (props) => {
  const { colors, images } = useResources();

  const { headerButtonProps, coordinator } = props;
  const { canGoBack } = headerButtonProps;

  if (canGoBack) {
    return (
      <Touchable
        onPress={() => {
          coordinator.goBack();
        }}
        accessible={true}
        accessibilityLabel="戻る"
        accessibilityHint="前の画面に移動します"
      >
        <SVGImage
          style={{ width: 28, height: 28 }}
          color={colors.background}
          source={images.svg.arrow_left}
        />
      </Touchable>
    );
  }
  return null;
};

export default HeaderLeftButton;
