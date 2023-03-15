import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import { Profile } from "../../../services/domains";
import { Touchable } from "../../../widgets/touchable";
import { useFetchSubscriptions } from "../../../services/graphql";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import moment from "moment";
import { currencyFormatter } from "../../../utils/strings";

export interface IAccountSubscriptionScreenProps {
  coordinator: AccountCoordinator;
}

export interface IAccountSubscriptionScreenParams {
  profile: Profile;
  accessToken: string;
}

export const AccountSubscriptionScreen: React.FC<
  IAccountSubscriptionScreenProps
> = () => {
  const headerHeight = useHeaderHeight();
  const { colors } = useResources();

  const {
    getSubscriptions,
    fetchingSubscriptions: loading,
    fetchingSubscriptionError: error,
    subscriptions,
    cancelSubscription,
    isReady,
    setIsReady,
  } = useFetchSubscriptions();

  useEffect(() => {
    getSubscriptions();
  }, []);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>There was an error.</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const _cancelSubscription = ({
    name,
    priceType,
    type,
    id,
  }: {
    name: string;
    priceType: string;
    type: string;
    id: string;
  }) => {
    Alert.alert(
      `Unsubscribe`,
      `Are you sure you want to unsubscribe ${
        type === "hotel" ? "宿泊" : "レンタルスペース"
      } subscription ${name} ${priceType}?`,
      [
        { text: `キャンセル`, style: "cancel", onPress: () => null },
        {
          text: "Unsubscribe",
          style: "destructive",
          onPress: () => {
            setIsReady(false);
            cancelSubscription({ variables: { id } });
          },
        },
      ]
    );
  };

  const renderStatus = ({
    currentPeriodEnd,
    isCanceled,
    endsAt,
    canceledAt,
    name,
    id,
    priceType,
    type,
  }: any) => {
    if (!isCanceled) {
      return (
        <View>
          <Text style={{ color: colors.textVariant }}>
            スターテス:{" "}
            <Text style={{ color: colors.primary, fontWeight: "500" }}>
              アクティブ
            </Text>
          </Text>
          <Text style={{ color: colors.textVariant, marginTop: 4 }}>
            更新日: {moment(currentPeriodEnd).format("YYYY年MM月DD日")}
          </Text>
          <Touchable
            style={{
              marginTop: 24,
              backgroundColor: `rgba(240,240,240,${isReady ? `1` : `0.5`})`,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 6,
            }}
            disabled={isReady}
            onPress={() => {
              _cancelSubscription({ name, priceType, type, id });
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
              スターテス:{" "}
              <Text style={{ color: "rgba(150,150,150,1)", fontWeight: "500" }}>
                キャンセル保留中
              </Text>
            </Text>
            <Text style={{ color: colors.textVariant, marginTop: 4 }}>
              キャンセル日: {moment(canceledAt).format("YYYY年MM月DD日")}
            </Text>
            <Text style={{ marginTop: 4, color: "red" }}>
              終了日: {moment(endsAt).format("YYYY年MM月DD日")}
            </Text>
          </View>
        );
      } else {
        // cancelled
        return (
          <View>
            <Text style={{ color: colors.textVariant }}>
              スターテス:{" "}
              <Text style={{ color: "red", fontWeight: "500" }}>
                キャンセル
              </Text>
            </Text>
            <Text style={{ color: colors.textVariant, marginTop: 4 }}>
              キャンセル日: {moment(canceledAt).format("YYYY年MM月DD日")}
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
        data={subscriptions?.mySubscriptions || []}
        renderItem={({ item }) => {
          const { name, priceType, type, remainingUnit, unit, amount } = item;
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
                      fontWeight: "bold",
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
                    {currencyFormatter(amount)}
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
