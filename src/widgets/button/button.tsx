import { CardView, ICardViewProps } from "../card-view";
import { ITouchableProps, Touchable } from "../touchable";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

export type IButtonProps = ITouchableProps &
  ICardViewProps & {
    title: string;
    containerStyle?: StyleProp<ViewStyle>;
    loading?: boolean;
    titleStyle?: StyleProp<TextStyle>;
  };

const Button: React.FC<IButtonProps> = (props) => {
  let {
    containerStyle,
    disabled,
    elevation,
    loading,
    titleStyle,
    title,
    ...touchableProps
  } = props;

  containerStyle = StyleSheet.flatten([
    styles.defaultContainer,
    containerStyle,
  ]);
  titleStyle = StyleSheet.flatten([
    styles.defaultTitle,
    titleStyle,
    styles.title,
  ]);

  return (
    <Touchable
      {...touchableProps}
      disabled={loading || disabled}
      style={[containerStyle, styles.outerContainer]}
    >
      <CardView
        elevation={elevation}
        style={[containerStyle, styles.innerContainer]}
      >
        <Text numberOfLines={1} style={titleStyle}>
          {title}
        </Text>
        {loading && (
          <ActivityIndicator
            color={titleStyle.color || "black"}
            size="small"
            style={[
              styles.loading,
              { backgroundColor: containerStyle.backgroundColor },
            ]}
          />
        )}
      </CardView>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  defaultTitle: {
    fontWeight: "bold",
  },
  defaultContainer: {
    borderRadius: 10,
    padding: 14,
  },
  innerContainer: {
    flexDirection: "row",
    flex: 1,
    margin: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  outerContainer: {
    flexDirection: "row",
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  loading: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
    margin: 10,
  },
  title: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default Button;
