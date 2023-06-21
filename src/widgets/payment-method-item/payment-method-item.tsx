import { Touchable } from "../touchable";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useResources } from "../../resources";
import { SVGImage } from "../svg-image";
import { usePaymentMethods } from "../../services/graphql";

export type IPaymentMethodItem = {
  id: string;
  token: string;
  type: string;
  expMonth: number;
  expYear: number;
  last4: string;
  brand: string;
  country: string;
  customer: string;
  isDefault: boolean;
};

export type IPaymentMethodItemProps = {
  item: IPaymentMethodItem;
};

const Button: React.FC<IPaymentMethodItemProps> = (props) => {
  let { item } = props;
  const { colors, images } = useResources();
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const { loading, setLoading, makeDefaultPaymentSource, removePaymentSource } =
    usePaymentMethods();

  const { id, brand, expMonth, expYear, last4, isDefault } = item;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 6,
        flexDirection: "column",
        alignItems: "flex-start",
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,

        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <SVGImage
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            source={images.svg[`card_${brand}`]}
            override={{ width: 50, height: 32 }}
            style={{ width: 16, height: 16 }}
          />
          <Text
            style={{
              marginLeft: 12,
              fontSize: 16,
              fontWeight: "600",
              fontVariant: ["tabular-nums"],
              color: colors.textVariant,
            }}
          >
            **** **** **** {last4}
          </Text>
          <Text
            style={{
              marginLeft: 12,
              fontSize: 14,
              fontVariant: ["tabular-nums"],
              color: colors.textVariant,
            }}
          >
            ({expMonth < 10 ? `0${expMonth}` : `${expMonth}`} /
            {`${expYear}`.slice(-2)})
          </Text>
        </View>
        <Touchable
          onPress={() => {
            setShowOptions(!showOptions);
          }}
        >
          <SVGImage
            source={images.svg.information_circle}
            color={colors.textVariant}
            style={{ width: 20, height: 20 }}
          />
        </Touchable>
      </View>
      {showOptions && (
        <View
          style={{
            marginTop: 12,
            marginBottom: 6,
            width: "100%",
            paddingHorizontal: 60,
          }}
        >
          {isDefault && (
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
              }}
            >
              既定の支払い方法
            </Text>
          )}
          {!isDefault && (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <Touchable
                disabled={loading}
                style={{ opacity: loading ? 0.5 : 1 }}
                onPress={() => {
                  Alert.alert(
                    `カード削除`,
                    `このカード削除してもよろしいですか？`,
                    [
                      { text: "キャンセル", style: "cancel" },
                      {
                        text: "削除",
                        style: "destructive",
                        onPress: () => {
                          setLoading(true);
                          removePaymentSource({
                            variables: { paymentMethodId: id },
                          });
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={{ color: "red", fontSize: 16 }}>カードを削除</Text>
              </Touchable>
              <Touchable
                disabled={loading}
                style={{ opacity: loading ? 0.5 : 1 }}
                onPress={() => {
                  Alert.alert(
                    `既定にする`,
                    `このカードをデフォルトの支払い方法にしますか?`,
                    [
                      { text: "キャンセル", style: "cancel" },
                      {
                        text: "既定にする",
                        style: "default",
                        onPress: () => {
                          setLoading(true);
                          makeDefaultPaymentSource({
                            variables: { paymentMethodId: id },
                          });
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={{ color: colors.textVariant, fontSize: 16 }}>
                  既定にする
                </Text>
              </Touchable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Button;
