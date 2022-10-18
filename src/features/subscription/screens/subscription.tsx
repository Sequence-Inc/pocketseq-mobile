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

const { height } = Dimensions.get("window");

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
        Alert.alert("Subscribed successfully.");
      },
      onError: () => {
        setSelectedPriceId(null);
        if (
          subscriptionFailed?.message ===
          `You have already subscribed to ${subscriptionType} subscription`
        ) {
          Alert.alert(`You have already subscribed to ${subscriptionType}`);
        } else {
          Alert.alert("Subscription failed. Try again later.");
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

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <View style={[styles.categoryWrapper(colors)]}>
        <Touchable
          onPress={() => setSubscriptionCategory(SUBSCRIPTION_CATEGORIES.A)}
          style={[
            styles.categoryPill(
              colors,
              subscriptionCategory === SUBSCRIPTION_CATEGORIES.A
            ),
          ]}
        >
          <Text
            style={[
              styles.categoryText(
                colors,
                subscriptionCategory === SUBSCRIPTION_CATEGORIES.A
              ),
            ]}
          >
            Category A
          </Text>
        </Touchable>
        <Touchable
          onPress={() => setSubscriptionCategory(SUBSCRIPTION_CATEGORIES.B)}
          style={[
            styles.categoryPill(
              colors,
              subscriptionCategory === SUBSCRIPTION_CATEGORIES.B
            ),
          ]}
        >
          <Text
            style={[
              styles.categoryText(
                colors,
                subscriptionCategory === SUBSCRIPTION_CATEGORIES.B
              ),
            ]}
          >
            Category B
          </Text>
        </Touchable>
        <Touchable
          onPress={() => setSubscriptionCategory(SUBSCRIPTION_CATEGORIES.C)}
          style={[
            styles.categoryPill(
              colors,
              subscriptionCategory === SUBSCRIPTION_CATEGORIES.C
            ),
          ]}
        >
          <Text
            style={[
              styles.categoryText(
                colors,
                subscriptionCategory === SUBSCRIPTION_CATEGORIES.C
              ),
            ]}
          >
            Category C
          </Text>
        </Touchable>
      </View>
      <ScrollView
        style={{ backgroundColor: colors.background, borderRadius: 10 }}
      >
        <View>
          {fetchingAllSubscriptions ? <Text>Loading...</Text> : <></>}
          {!fetchingAllSubscriptions && fetchingAllSubscriptionError ? (
            <Text>Opps...</Text>
          ) : (
            <></>
          )}
          {!fetchingAllSubscriptions && !subscriptions.length ? (
            <Text>Subscriptions not availale</Text>
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
                    <Text style={[styles.planCardHeader]}>
                      {subscription.categoryName}
                    </Text>
                    <Text style={[styles.planCardDesc]}>
                      Spend {subscription.unit} hours a month
                    </Text>
                  </View>
                  <View style={[styles.planCardPrice]}>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[styles.priceText]}>
                        {subscription.amount}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "200",
                          fontSize: 16,
                          marginLeft: 5,
                        }}
                      >
                        / month
                      </Text>
                    </View>

                    <Button
                      title={`Buy ${subscription.categoryName}`}
                      titleStyle={{ color: colors.background }}
                      loading={
                        creatingSubscription &&
                        selectedPriceId === subscription.id
                      }
                      disabled={
                        !!creatingSubscription &&
                        selectedPriceId !== subscription.id
                      }
                      containerStyle={{
                        margin: 20,
                        backgroundColor: colors.primaryVariant,
                      }}
                      onPress={() => hadleBuySubscription(subscription.id)}
                    />
                  </View>
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
  categoryWrapper: (color: Colors) => ({
    justifyContent: "space-evenly",
    height: height / 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 10,
    backgroundColor: color.backgroundVariant,
  }),
  categoryPill: (color: Colors, selected: boolean) => ({
    borderWidth: selected ? 1.5 : 0,
    height: "100%",
    display: "flex",
    flex: 1 / 3.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 10,
    borderColor: selected ? color.primaryVariant : "rgba(120,120,120,0.2)",
    backgroundColor: selected ? color.background : color.backgroundVariant,
    elevation: 3,
  }),
  categoryText: (colors: Colors, selected: boolean) => ({
    fontWeight: "700",
    color: selected ? colors.text : colors.textVariant,
  }),
  planCardWrapper: {
    display: "flex",
    height: height / 4,
    borderWidth: 1,
    margin: 10,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderColor: "rgba(125,125,125,0.2)",
  },
  planCardTitleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  planCardHeader: {
    fontWeight: "bold",
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 2,
  },
  planCardDesc: {
    fontWeight: "200",
    fontSize: 17,
    lineHeight: 30,
    letterSpacing: 2,
  },
  planCardPrice: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    // alignItems: "flex-end",
    // justifyContent: "center",
    // flexDirection: "row",
  },
  priceText: {
    fontSize: 32,
  },
});
