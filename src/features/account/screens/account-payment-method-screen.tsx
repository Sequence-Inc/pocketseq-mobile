import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import { PaymentSource, Profile } from "../../../services/domains";
import { Touchable } from "../../../widgets/touchable";
import { AppCache, AppClient, useAccount } from "../../../services/graphql";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { SVGImage } from "../../../widgets/svg-image";

export interface IAccountPaymentMethodScreenProps {
  coordinator: AccountCoordinator;
}

export interface IAccountPaymentMethodScreenParams {
  profile: Profile;
  accessToken: string;
}

export const AccountPaymentMethodScreen: React.FC<
  IAccountPaymentMethodScreenProps
> = ({ coordinator }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>();

  const route: RouteProp<{ params: IAccountPaymentMethodScreenParams }> =
    useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images, strings } = useResources();

  const { profile, accessToken } = route.params;
  const { getPaymentSources } = useAccount();

  const getData = useCallback(async () => {
    try {
      const { data, errors } = await getPaymentSources(accessToken);

      if (!errors) {
        setPaymentSources(data);
      } else {
        Alert.alert("Error fetching data.");
      }
    } catch (error: any) {
      if (error) {
        Alert.alert(error.message);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.backgroundVariant,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <FlatList
        data={paymentSources || []}
        renderItem={({ item, index }) => {
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.background,
                padding: 12,
                marginHorizontal: 12,
                marginVertical: 6,
                flexDirection: "row",
                alignItems: "center",
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
                  flexGrow: 1,
                }}
              >
                <SVGImage
                  source={images.svg[`card_${item.brand}`]}
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
                  **** **** **** {item.last4}
                </Text>
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: 16,
                    fontVariant: ["tabular-nums"],
                    color: colors.textVariant,
                  }}
                >
                  (
                  {item.expMonth < 10
                    ? `0${item.expMonth}`
                    : `${item.expMonth}`}{" "}
                  /{`${item.expYear}`.slice(-2)})
                </Text>
              </View>
              <View>
                {item.isDefault && (
                  <Text style={{ color: colors.primary, fontSize: 16 }}>
                    既定
                  </Text>
                )}
                {!item.isDefault && (
                  <Text style={{ color: "red", fontSize: 16 }}>消す</Text>
                )}
              </View>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginTop: 32,
                  marginBottom: 24,
                  flexGrow: 1,
                }}
              >
                登録してるカード
              </Text>
              <Touchable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.background,
                  paddingHorizontal: 18,
                  paddingVertical: 9,
                  borderRadius: 3,
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
                <SVGImage
                  source={images.svg.card_generic}
                  override={{ width: 24, height: 15 }}
                  color={colors.background}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.textVariant,
                    marginLeft: 8,
                  }}
                >
                  カード追加
                </Text>
              </Touchable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};
