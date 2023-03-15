import { Text, View } from "react-native";
import React from "react";

import { Checkbox } from "../checkbox";

import { observer } from "mobx-react";
import { styleStore, SessionStore } from "../../services/storage";
import { useResources } from "../../resources";

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
  const { colors } = useResources();
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
            { justifyContent: "space-between", marginBottom: 16 },
          ]}
        >
          <Text
            style={[
              globalStyles.row,
              { fontSize: 16, color: colors.textVariant, fontWeight: "700" },
            ]}
          >
            {subscriptionType === "hotel" ? "宿泊" : "レンタルスペース"}
            {" - "}
            {hasSubscription?.name || ""} {hasSubscription?.priceType || ""}
          </Text>

          {/* <Text style={{ fontWeight: "bold" }}>
            {hasSubscription?.amount || ""}
            /月
          </Text> */}
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              color: colors.textVariant,
            }}
          >
            {utilizedUnits}/{hasSubscription.unit}{" "}
            {subscriptionType === "rental-space" ? "泊" : "時間"}
          </Text>
        </View>

        {/* <View
          style={[
            globalStyles.row,
            {
              justifyContent: "space-between",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 16,
              color: colors.textVariant,
            }}
          >
            Subscription units used
          </Text>
          
        </View> */}
      </>
    );
  }, [subscriptionType, hasSubscription, utilizedUnits]);

  if (!accessToken)
    return (
      <Text style={{ fontSize: 16 }}>
        ログインして支払い方法をロードしてください。
      </Text>
    );

  if (!spaceDetail?.subcriptionPrice) {
    return (
      <Text style={{ fontSize: 16 }}>
        サブスクリプションはこのスペースには適用されません。
      </Text>
    );
  }
  if (!hasSubscription) {
    return (
      <Text style={{ fontSize: 16 }}>サブスクリプションはありません。</Text>
    );
  }

  if (hasSubscription?.remainingUnit < 1) {
    return (
      <>
        {/* Subscription card here */}
        {commonSubscriptionCard}
        <Text>サブスクリプションをフル活用。</Text>;\
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.textVariant,
            }}
          >
            サブスクリプションを使用する
          </Text>

          <Checkbox
            value={useSubscription}
            onValueChange={(val) => onSelect(val)}
          />
        </View>
        <Text style={{ fontSize: 16, color: colors.textVariant }}>
          サブスクリプションを適用できます。
        </Text>
      </>
    );
  }

  if (hasSubscription?.amount < spaceDetail?.subcriptionPrice) {
    return (
      <>
        {commonSubscriptionCard}

        <View style={[globalStyles.row, { justifyContent: "space-between" }]}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.textVariant,
            }}
          >
            サブスクリプションを使用する
          </Text>

          <Checkbox
            value={useSubscription}
            onValueChange={(val) => onSelect(val)}
          />
        </View>
        <Text style={{ fontSize: 14, color: colors.textVariant }}>
          あなたのサブスクリプションにはこのスペースが含まれていません。
        </Text>
      </>
    );
  }
  return <></>;
};

export default observer(Subscription);
