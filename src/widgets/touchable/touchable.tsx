import React from "react";
import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export type ITouchableProps = TouchableWithoutFeedbackProps & { touchType?: "flick" | "none" };

const NO_FLICK_OPACITY = 1;
const FLICK_OPACITY = 0.5;

const Touchable: React.FC<ITouchableProps> = (props) => {
  const { children, style, touchType = "flick", ...touchableProps } = props;

  const flickOpacity = useSharedValue(NO_FLICK_OPACITY);
  const rFlick = useAnimatedStyle(() => ({ opacity: withTiming(flickOpacity.value, { duration: 100 }) }));

  const onPressIn = React.useCallback(
    (event) => {
      if (touchType === "flick") flickOpacity.value = FLICK_OPACITY;
      touchableProps.onPressIn && touchableProps.onPressIn(event);
    },
    [flickOpacity, touchType]
  );

  const onPressOut = React.useCallback(
    (event) => {
      if (touchType === "flick") flickOpacity.value = NO_FLICK_OPACITY;
      touchableProps.onPressOut && touchableProps.onPressOut(event);
    },
    [flickOpacity, touchType]
  );

  return (
    <TouchableWithoutFeedback {...touchableProps} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[style, rFlick]}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Touchable;
