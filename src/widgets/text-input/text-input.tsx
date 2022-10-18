import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export type ITextInputProps = Omit<TextInputProps, 'style'> & {
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  iconLeft?: () => React.ReactElement;
  iconRight?: () => React.ReactElement;
  label?: string;
  textStyle?: StyleProp<TextStyle>;
  tint?: string;
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
    { borderColor: error ? 'red' : tint ? tint : undefined },
    iconLeft ? { paddingLeft: 0 } : { paddingLeft: 10 },
    iconRight ? { paddingRight: 0 } : { paddingRight: 10 },
  ]);

  const fLabelStyle = StyleSheet.flatten([styles.label, { color: error ? 'red' : tint ? tint : undefined }]);

  return (
    <View style={fContainerStyle}>
      {label && <Text style={fLabelStyle}>{label}</Text>}
      {iconLeft && <View style={styles.iconContainer}>{iconLeft()}</View>}
      <View style={styles.textInputContainer}>
        <RNTextInput {...textInputProps} style={[textStyle, styles.textInput]} />
      </View>
      {iconRight && <View style={styles.iconContainer}>{iconRight()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    borderColor: 'black',
    borderRadius: 2,
    borderWidth: 1,
    height: 48,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    height: '100%',
    width: 48,
  },
  label: {
    position: 'absolute',
    top: -7,
    left: 7,
    backgroundColor: 'white',
    height: 10,
    fontSize: 10,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  textInput: {
    flex: 1,
    width: '100%',
  },
});

export default TextInput;
