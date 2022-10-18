import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import {
  PaymentSource,
  Profile,
  UserSubscription,
} from "../../../services/domains";
import { Touchable } from "../../../widgets/touchable";
import { useAccount } from "../../../services/graphql";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { SVGImage } from "@widgets/svg-image";
import moment from "moment";

export interface IAccountSubscriptionScreenProps {
  coordinator: AccountCoordinator;
}

export interface IAccountSubscriptionScreenParams {
  profile: Profile;
  accessToken: string;
}

export const AccountSubscriptionScreen: React.FC<
  IAccountSubscriptionScreenProps
> = ({ coordinator }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>();

  const route: RouteProp<{ params: IAccountSubscriptionScreenParams }> =
    useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images, strings } = useResources();

  const { getSubscriptions } = useAccount();

  const getData = useCallback(async () => {
    try {
      const { data, error } = await getSubscriptions();

      if (!error) {
        setSubscriptions(data?.mySubscriptions);
      } else {
        Alert.alert("Error fetching data.");
      }
    } catch (error: any) {
      if (error) {
        console.log(error);
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

  const renderStatus = ({
    currentPeriodEnd,
    isCanceled,
    endsAt,
    canceledAt,
  }: UserSubscription) => {
    if (!isCanceled) {
      return (
        <View>
          <Text style={{ color: colors.textVariant }}>
            Status:{" "}
            <Text style={{ color: colors.primary, fontWeight: "500" }}>
              Active
            </Text>
          </Text>
          <Text style={{ color: colors.textVariant, marginTop: 4 }}>
            Renewal on: {moment(currentPeriodEnd).format("YYYY年MM月DD日")}
          </Text>
          <Touchable
            style={{
              marginTop: 24,
              backgroundColor: "rgba(240,240,240,1)",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(150,150,150,1)",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              キャンセル
            </Text>
          </Touchable>
        </View>
      );
    } else {
      if (moment(endsAt).isAfter(moment())) {
        // pending cancellation
        return (
          <View>
            <Text style={{ color: colors.textVariant }}>
              Status:{" "}
              <Text style={{ color: "rgba(150,150,150,1)", fontWeight: "500" }}>
                Pending cancelation
              </Text>
            </Text>
            <Text style={{ color: colors.textVariant, marginTop: 4 }}>
              Canceled at: {moment(canceledAt).format("YYYY年MM月DD日")}
            </Text>
            <Text style={{ marginTop: 4, color: "red" }}>
              Ends on: {moment(endsAt).format("YYYY年MM月DD日")}
            </Text>
          </View>
        );
      } else {
        // cancelled
        return (
          <View>
            <Text style={{ color: colors.textVariant }}>
              Status:{" "}
              <Text style={{ color: "red", fontWeight: "500" }}>Cancelled</Text>
            </Text>
            <Text style={{ color: colors.textVariant, marginTop: 4 }}>
              Canceled at: {moment(canceledAt).format("YYYY年MM月DD日")}
            </Text>
          </View>
        );
      }
    }
  };

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
        data={subscriptions || []}
        renderItem={({ item, index }) => {
          const {
            id,
            name,
            priceType,
            type,
            remainingUnit,
            unit,
            amount,
            isCanceled,
          } = item;
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.background,
                padding: 12,
                marginHorizontal: 12,
                marginVertical: 6,
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
                <View
                  style={{
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.primary,
                    }}
                  >
                    {type === "hotel" ? "宿泊" : "レンタルスペース"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      fontVariant: ["tabular-nums"],
                      color: colors.textVariant,
                      flexGrow: 1,
                      marginTop: 6,
                    }}
                  >
                    {name} {priceType}
                  </Text>
                </View>
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: 16,
                    fontVariant: ["tabular-nums"],
                    color: colors.textVariant,
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 20 }}>
                    {amount}
                  </Text>
                  /月
                </Text>
              </View>
              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 6,
                    flexGrow: 1,
                    backgroundColor: colors.backgroundVariant,
                    position: "relative",
                    borderRadius: 6,
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      height: 6,
                      backgroundColor: colors.primary,
                      borderRadius: 6,
                      width: `${((unit - remainingUnit) / unit) * 100}%`,
                    }}
                  ></View>
                </View>
                <Text
                  style={{
                    width: 80,
                    textAlign: "right",
                    color: colors.textVariant,
                  }}
                >
                  {unit - remainingUnit}/{unit}
                  {type === "hotel" ? "泊" : "時間"}
                </Text>
              </View>
              <View style={{ marginTop: 12 }}>{renderStatus(item)}</View>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return <View style={{ height: 6 }}></View>;
        }}
      />
    </SafeAreaView>
  );
};
