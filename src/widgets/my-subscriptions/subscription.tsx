import { Text, View } from "react-native";
import React from "react";

import { Checkbox } from "../checkbox";

import { observer } from "mobx-react";
import { styleStore, SessionStore } from "../../services/storage";

const noOp = (data: any) => data;
export type SubscriptionProps = {
  onSelect?: Function;
  subscriptionType: "hotel" | "rental-space";
  priceData: any;
  spaceDetail?: any;
  subscriptionCategoryPrice?: number;
  useSubscription: boolean;
  hasSubscription: any;
};

const Subscription = ({
  onSelect = noOp,
  subscriptionType,
  spaceDetail,
  priceData,
  subscriptionCategoryPrice,
  useSubscription,
  hasSubscription,
}: SubscriptionProps) => {
  const [{ globalStyles }] = React.useState(styleStore);

  const [{ accessToken }] = React.useState(() => SessionStore);

  const utilizedUnits = React.useMemo(() => {
    if (!hasSubscription) return 0;
    if (useSubscription && priceData?.subscriptionUnit) {
      return (
        hasSubscription.unit -
        hasSubscription.remainingUnit +
        priceData.subscriptionUnit
      );
    } else {
      return hasSubscription.unit - hasSubscription.remainingUnit;
    }
  }, [priceData, hasSubscription, useSubscription]);

  const commonSubscriptionCard = React.useMemo(() => {
    if (!hasSubscription) return <></>;
    return (
      <>
        <View
          style={[
            globalStyles.row,
            { justifyContent: "space-between", marginVertical: 10 },
          ]}
        >
          <Text style={[globalStyles.row]}>
            {subscriptionType === "hotel" ? "宿泊" : "レンタルスペース"}
            {" - "}
            {hasSubscription?.name || ""} {hasSubscription?.priceType || ""}
          </Text>

          <Text style={{ fontWeight: "bold" }}>
            {hasSubscription?.amount || ""}
            /月
          </Text>
        </View>

        <View
          style={[
            globalStyles.row,
            { justifyContent: "space-between", marginVertical: 10 },
          ]}
        >
          <Text>Subscription units used</Text>
          <Text style={{ fontWeight: "bold" }}>
            {utilizedUnits}/{hasSubscription.unit}
            <Text style={{ marginLeft: 10 }}>
              {" "}
              {subscriptionType === "rental-space" ? "泊" : "時間"}
            </Text>
          </Text>
        </View>
      </>
    );
  }, [subscriptionType, hasSubscription, utilizedUnits]);

  if (!accessToken) return <Text>Please login to load payment source.</Text>;

  if (!spaceDetail?.subcriptionPrice) {
    return <Text>Subscription not applicable to this hotel room.</Text>;
  }
  if (!hasSubscription) {
    return (
      <Text>You currently are not subscribed to any subscription plan.</Text>
    );
  }

  if (hasSubscription?.remainingUnit < 1) {
    return (
      <>
        {/* Subscription card here */}
        {commonSubscriptionCard}
        <Text>You subscription is already fully utilized.</Text>;\
      </>
    );
  }

  if (
    hasSubscription?.amount > (subscriptionCategoryPrice || 0) ||
    hasSubscription?.amount > spaceDetail?.subcriptionPrice
  ) {
    return (
      <>
        {commonSubscriptionCard}
        {/* <SubscriptionCard
              useSubscription={useSubscription}
              priceData={priceData}
              hasHotelSubscriptions={hasHotelSubscriptions}
          /> */}
        <View style={[globalStyles.row, { justifyContent: "space-between" }]}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Use Subscription
          </Text>

          <Checkbox
            value={useSubscription}
            onValueChange={(val) => onSelect(val)}
          />
        </View>
        <Text>Your subscription can be applied.</Text>
      </>
    );
  }

  if (hasSubscription?.amount < spaceDetail?.subcriptionPrice) {
    return (
      <>
        {commonSubscriptionCard}

        <View style={[globalStyles.row, { justifyContent: "space-between" }]}>
          <Text>Use Subscription</Text>

          <Checkbox
            value={useSubscription}
            onValueChange={(val) => onSelect(val)}
          />
        </View>
        <Text>Your subscription does not cover for this space.</Text>
      </>
    );
  }
  return <></>;
};

export default observer(Subscription);
