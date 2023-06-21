import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import {
  SubscriptionCoordinator,
  TTO_SUBSCRIPTION_PROPS,
} from "../subscription-coordinator";
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import {
  useBuySubscription,
  useFetchAllSubscriptions,
} from "../../../services/graphql";
import { styleStore } from "../../../services/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useResources } from "../../../resources";
import { Touchable } from "../../../widgets/touchable";
import { Button } from "../../../widgets/button";
import { CardView } from "../../../widgets/card-view";
import { currencyFormatter } from "../../../utils/strings";

const { width, height } = Dimensions.get("window");

type Colors = {
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  background: string;
  backgroundVariant: string;
  surface: string;
  surfaceVariant: string;
  error: string;
  text: string;
  textVariant: string;
  link: string;
};
export type ISpaceReservationConfirmationProps = {
  coordinator: SubscriptionCoordinator;
};

export type TUseCalculateSpacePriceProps = {
  fromDateTime?: any;
  duration?: any;
  durationType?: any;
  spaceId?: any;
  additionalOptionsFields?: any[];
  useSubscription?: boolean;
};

export type SubscriptionCategoryType = "A" | "B" | "C";

const SUBSCRIPTION_CATEGORIES: Record<string, SubscriptionCategoryType> = {
  A: "A",
  B: "B",
  C: "C",
};

export const Subscription: React.FC<ISpaceReservationConfirmationProps> = ({
  coordinator,
}) => {
  const route: RouteProp<{ params: TTO_SUBSCRIPTION_PROPS }> = useRoute();
  const [subscriptions, setSubscriptions] = React.useState<any[]>([]);
  const [{ globalStyles }] = React.useState(() => styleStore);
  const [subscriptionCategory, setSubscriptionCategory] =
    React.useState<SubscriptionCategoryType>(SUBSCRIPTION_CATEGORIES.A);
  const [selectedPriceId, setSelectedPriceId] = React.useState<string | null>(
    null
  );
  const { colors } = useResources();
  const headerHeight = useHeaderHeight();

  const {
    params: { subscriptionType },
  } = route;
  const {
    allSubscription,
    fetchingAllSubscriptionError,
    fetchingAllSubscriptions,
  } = useFetchAllSubscriptions();
  const { creatingSubscription, onBuySubscription, subscriptionFailed } =
    useBuySubscription({
      onCompleted: () => {
        setSelectedPriceId(null);
        Alert.alert("サブスクリプションが成功しました。");
      },
      onError: () => {
        setSelectedPriceId(null);
        if (
          subscriptionFailed?.message ===
          `You have already subscribed to ${subscriptionType} subscription`
        ) {
          Alert.alert(
            `加入しています`,
            `既に ${
              subscriptionType === "hotel" ? "ホテル" : "スペース"
            } サブスクリプションに加入しています`
          );
        } else if (subscriptionFailed?.message === "Not authorized") {
          Alert.alert(
            `ログインしてください`,
            `サブスクリプションに登録する前にログインしてください。`
          );
        } else if (
          subscriptionFailed?.message ===
          "Cannot charge a customer that has no active card"
        ) {
          Alert.alert(
            "カードがありません",
            "アカウントにカードを追加してください。"
          );
        } else {
          Alert.alert(
            "失敗しました",
            "サブスクリプションに失敗しました。 後でもう一度試してください。"
          );
        }
      },
    });

  const handleFetchAllSubscriptions = React.useCallback(() => {
    if (fetchingAllSubscriptions) return;

    let filteredSubscriptions = [];
    for (const subscription of allSubscription) {
      if (subscription.type === subscriptionType) {
        const subscriptionPlan = subscription.prices.find(
          (plan: Record<any, any>) => plan.name === subscriptionCategory
        );

        filteredSubscriptions.push({
          ...subscriptionPlan,
          unit: subscription.unit,
          categoryName: subscription.name,
        });
      }
    }
    setSubscriptions([
      ...filteredSubscriptions.sort((a, b) => a.amount - b.amount),
    ]);
  }, [
    allSubscription,
    fetchingAllSubscriptions,
    subscriptionCategory,
    subscriptionType,
  ]);

  const hadleBuySubscription = (priceId: string) => {
    setSelectedPriceId(priceId);
    return onBuySubscription(priceId);
  };

  useFocusEffect(handleFetchAllSubscriptions);

  const subscriptionUnit = subscriptionType === "hotel" ? "日" : "時間";

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <View
        style={[
          styles.categoryWrapper,
          {
            backgroundColor: colors.backgroundVariant,
          },
        ]}
      >
        {Object.keys(SUBSCRIPTION_CATEGORIES).map((key) => {
          const selected =
            subscriptionCategory === SUBSCRIPTION_CATEGORIES[key];
          return (
            <Touchable
              key={key}
              onPress={() =>
                setSubscriptionCategory(SUBSCRIPTION_CATEGORIES[key])
              }
              style={[
                styles.categoryPill,
                {
                  backgroundColor: selected
                    ? colors.primaryVariant
                    : colors.background,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selected ? colors.background : colors.textVariant,
                  },
                ]}
              >
                カテゴリー{SUBSCRIPTION_CATEGORIES[key]}
              </Text>
            </Touchable>
          );
        })}
      </View>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View>
          {fetchingAllSubscriptions ? <Text>読み込み中...</Text> : <></>}
          {!fetchingAllSubscriptions && fetchingAllSubscriptionError ? (
            <Text>エラーが発生しました。 後でもう一度試してください。</Text>
          ) : (
            <></>
          )}
          {!fetchingAllSubscriptions && !subscriptions.length ? (
            <Text>サブスクリプション プランは利用できません。</Text>
          ) : (
            <></>
          )}
          {subscriptions.length > 0 ? (
            subscriptions.map(
              (subscription: Record<any, any>, index: number) => (
                <CardView
                  key={index}
                  elevation={6}
                  style={[styles.planCardWrapper]}
                >
                  <View style={[styles.planCardTitleSection]}>
                    <Text
                      style={[
                        styles.planCardHeader,
                        { color: colors.primaryVariant },
                      ]}
                    >
                      {subscription.categoryName}
                    </Text>
                    <Text
                      style={[
                        styles.planCardDesc,
                        { color: colors.textVariant },
                      ]}
                    >
                      毎月{subscription.unit}
                      {subscriptionUnit}を使う
                    </Text>
                  </View>
                  <View style={[styles.planCardPrice]}>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={[styles.priceText, { color: colors.text }]}>
                        {currencyFormatter(subscription.amount)}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: 18,
                          marginLeft: 6,
                          marginBottom: 7,
                          color: colors.textVariant,
                        }}
                      >
                        /月
                      </Text>
                    </View>
                  </View>
                  <Button
                    title={`${subscription.categoryName}を買う`}
                    titleStyle={{
                      color: colors.background,
                      fontSize: 16,
                      fontWeight: "900",
                    }}
                    loading={
                      creatingSubscription &&
                      selectedPriceId === subscription.id
                    }
                    disabled={
                      !!creatingSubscription &&
                      selectedPriceId !== subscription.id
                    }
                    containerStyle={
                      (styles.priceButtonContainer,
                      { backgroundColor: colors.primaryVariant })
                    }
                    onPress={() => hadleBuySubscription(subscription.id)}
                  />
                </CardView>
              )
            )
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categoryWrapper: {
    justifyContent: "space-evenly",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  categoryPill: {
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  categoryText: {
    fontWeight: "700",
  },
  planCardWrapper: {
    width: width - 12 * 2,
    borderWidth: 1,
    margin: 12,
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255,255,255,1)",
  },
  planCardTitleSection: {
    alignItems: "center",
    marginTop: 6,
  },
  planCardHeader: {
    fontWeight: "bold",
    fontSize: 22,
  },
  planCardDesc: {
    fontWeight: "300",
    fontSize: 18,
    marginTop: 6,
  },
  planCardPrice: {
    width: "100%",
    marginVertical: 24,
    justifyContent: "center",
  },
  priceText: {
    fontSize: 32,
    fontWeight: "700",
  },
  priceButtonContainer: {
    borderRadius: 6,
  },
});
