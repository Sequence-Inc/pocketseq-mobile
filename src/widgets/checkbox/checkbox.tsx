import ExpoCheckbox, { CheckboxProps } from 'expo-checkbox';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export type ICheckboxProps = CheckboxProps & {
  containerStyle?: StyleProp<ViewStyle>;
  onTextPress?: () => void;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
};

const Checkbox: React.FC<ICheckboxProps> = ({ containerStyle, onTextPress, style, text, textStyle, ...props }) => {
  const fContainerStyle = StyleSheet.flatten([styles.defaultContainer, containerStyle, styles.container]);

  const fCheckboxStyle = StyleSheet.flatten([style, styles.checkbox]);

  const fTextStyle = StyleSheet.flatten([textStyle, styles.text]);

  return (
    <View style={fContainerStyle}>
      <ExpoCheckbox {...props} style={fCheckboxStyle} />
      {text && (
        <Text onPress={onTextPress} style={fTextStyle}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    height: 48,
  },
  checkbox: {
    marginHorizontal: 12,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 12,
  },
});

export default Checkbox;
