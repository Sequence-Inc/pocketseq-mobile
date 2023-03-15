import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export type ITextInputProps = Omit<TextInputProps, "style"> & {
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  iconLeft?: () => React.ReactElement;
  iconRight?: () => React.ReactElement;
  label?: string;
  textStyle?: StyleProp<TextStyle>;
  tint?: string;
  disabled?: boolean;
};

const TextInput: React.FC<ITextInputProps> = ({
  containerStyle,
  error,
  iconLeft,
  iconRight,
  label,
  textStyle,
  tint,
  ...textInputProps
}) => {
  const fContainerStyle = StyleSheet.flatten([
    styles.defaultContainer,
    containerStyle,
    styles.container,
    { borderColor: error ? "red" : tint ? tint : "rgba(0,0,0,0.3)" },
    iconLeft ? { paddingLeft: 0 } : { paddingLeft: 10 },
    iconRight ? { paddingRight: 0 } : { paddingRight: 10 },
  ]);

  const fLabelStyle = StyleSheet.flatten([
    styles.label,
    { color: error ? "red" : tint ? tint : "rgba(0,0,0,0.75)" },
  ]);

  return (
    <View style={fContainerStyle}>
      {label && <Text style={fLabelStyle}>{label}</Text>}
      {iconLeft && <View style={styles.iconContainer}>{iconLeft()}</View>}
      <View style={styles.textInputContainer}>
        <RNTextInput
          {...textInputProps}
          style={[textStyle, styles.textInput]}
        />
      </View>
      {iconRight && <View style={styles.iconContainer}>{iconRight()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    borderColor: "green",
    borderRadius: 6,
    borderWidth: 1,
    height: 48,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    height: "100%",
    width: 48,
  },
  label: {
    position: "absolute",
    top: -6,
    left: 6,
    backgroundColor: "white",
    height: 12,
    fontSize: 12,
    lineHeight: 12,
    paddingHorizontal: 4,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
  },
  textInput: {
    flex: 1,
    width: "100%",
  },
});

export default TextInput;
