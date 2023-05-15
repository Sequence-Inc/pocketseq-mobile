import React from "react";
import { SvgProps, SvgCss } from "react-native-svg";

export interface ISvgImageProps extends Omit<SvgProps, "width" | "height"> {
  source: string;
  override?: SvgProps;
}

const SVGImage: React.FC<ISvgImageProps> = ({ source, ...otherProps }) => {
  return <SvgCss xml={source} {...otherProps} />;
};

export default SVGImage;
