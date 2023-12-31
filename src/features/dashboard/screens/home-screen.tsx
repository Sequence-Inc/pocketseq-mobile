import {
  HotelPlan,
  SpacePricePlan,
  SpacePricePlanType,
} from "../../../services/domains";
import { useHomeScreen } from "../../../services/graphql";
import React, { ReactElement, useEffect } from "react";
import { View, Text, Image, Dimensions, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useResources } from "../../../resources";
import DashboardCoordinator from "../dashboard-coordinator";
import { Touchable } from "../../../widgets/touchable";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import {
  HotelSearchFilterOptions,
  SpaceSearchFilterOptions,
} from "../../../features/search/search-helpers";
import { SubscriptionBanner } from "../../../features/subscription";
import { currencyFormatter } from "../../../utils/strings";
import { NetworkStatus } from "@apollo/client";

export type IHomeScreenProps = {
  coordinator: DashboardCoordinator;
};

const { width } = Dimensions.get("window");

export const HomeScreen: React.FC<IHomeScreenProps> = ({ coordinator }) => {
  const { colors } = useResources();
  const { getTopPicks, result } = useHomeScreen({ take: 8, skip: 0 });

  useEffect(() => {
    getTopPicks();
  }, []);

  const { refetch, networkStatus } = result;
  //

  const refresh = async () => {
    await refetch();
  };

  if (result.loading && networkStatus !== NetworkStatus.refetch) {
    return <FullScreenActivityIndicator />;
  }

  const getCheapPrice = (
    pricePlans: SpacePricePlan[]
  ): { amount: number; type: SpacePricePlanType } => {
    let amount: number = 9999999999;
    let type: SpacePricePlanType = "HOURLY";
    pricePlans.map((plan) => {
      if (plan.amount < amount) {
        amount = plan.amount;
        type = plan.type;
      }
    });
    return { amount, type };
  };

  const renderSpacePrice = (
    pricePlans: SpacePricePlan[]
  ): ReactElement<any, any> => {
    const price = getCheapPrice(pricePlans);
    return (
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.surface }}>
        {currencyFormatter(price.amount)}
        <Text
          style={{ fontSize: 14, fontWeight: "500", color: colors.textVariant }}
        >
          /{spacePricePlanTypeFormatter(price.type)}
        </Text>
      </Text>
    );
  };

  const renderHotelPrice = (plans: HotelPlan[]): ReactElement<any, any> => {
    let min = 9999999999;
    plans.map((plan) => {
      plan.roomTypes.map((roomPlan) => {
        roomPlan.priceSettings.map((price) => {
          const { roomCharge, oneAdultCharge } = price.priceScheme;
          if (roomCharge < min) {
            min = roomCharge;
          } else if (oneAdultCharge < min) {
            min = oneAdultCharge;
          }
        });
      });
    });
    return (
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.surface }}>
        {currencyFormatter(min)}
        <Text
          style={{ fontSize: 14, fontWeight: "500", color: colors.textVariant }}
        >
          /泊
        </Text>
      </Text>
    );
  };

  const spacePricePlanTypeFormatter = (type: SpacePricePlanType): string => {
    const types = {
      DAILY: "日",
      HOURLY: "時間",
      MINUTES: "分",
    };
    return types[type];
  };

  const goToSpace = (spaceId: string) => {
    coordinator.toSpaceScreen("navigate", { spaceId });
    return null;
  };
  const goToHotel = (hotelId: string) => {
    coordinator.toHotelScreen("navigate", { hotelId });
    return null;
  };
  const goToSearch = (
    params: HotelSearchFilterOptions & SpaceSearchFilterOptions
  ) => {
    coordinator.toSearchResultScreen("navigate", { ...params });
    return null;
  };

  const goToSubscription = (subscriptionType: string) =>
    coordinator.toSubscriptionsScreen("navigate", { subscriptionType });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: colors.backgroundVariant, flex: 1 }}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={refresh}
            title="リフレッシュ中"
          />
        }
      >
        {/* Space Types */}
        <View
          style={{
            width: width,
            marginTop: 12,
            marginBottom: 12,
            paddingVertical: 12,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 12,
              paddingHorizontal: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                目的に応じて探す
              </Text>
            </View>
            <Touchable onPress={() => goToSearch({ searchType: "SPACE" })}>
              <Text style={{ color: colors.textVariant, fontSize: 12 }}>
                もっと見る
              </Text>
            </Touchable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 6 }}
          >
            {result.data?.availableSpaceTypes &&
              result.data?.availableSpaceTypes?.length > 0 &&
              result.data?.availableSpaceTypes?.map((spaceType) => (
                <Touchable
                  key={spaceType.id}
                  style={{ marginHorizontal: 6 }}
                  onPress={() =>
                    goToSearch({
                      searchType: "SPACE",
                      spaceType: spaceType.title,
                    })
                  }
                >
                  <Image
                    source={{ uri: spaceType?.photo?.medium.url }}
                    style={{
                      width: 100,
                      height: 70,
                      borderRadius: 4,
                      marginBottom: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "center",
                      color: colors.textVariant,
                    }}
                  >
                    {spaceType.title}
                  </Text>
                </Touchable>
              ))}
          </ScrollView>
        </View>

        {/* New Spaces */}
        <View
          style={{
            width: width,
            marginBottom: 12,
            paddingVertical: 12,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 12,
              paddingHorizontal: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "500",
                  fontSize: 18,
                }}
              >
                新着スペース
              </Text>
            </View>
            <Touchable onPress={() => goToSearch({ searchType: "SPACE" })}>
              <Text style={{ color: colors.textVariant, fontSize: 12 }}>
                もっと見る
              </Text>
            </Touchable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 6 }}
          >
            {result.data?.allSpaces.data &&
              result.data?.allSpaces?.data?.length > 0 &&
              result.data?.allSpaces?.data?.map((space) => (
                <Touchable key={space.id} onPress={() => goToSpace(space.id)}>
                  <View style={{ marginHorizontal: 6, width: 160 }}>
                    <Image
                      source={{ uri: space.photos[0].medium.url }}
                      style={{
                        width: 160,
                        height: 100,
                        borderRadius: 4,
                        marginBottom: 6,
                        backgroundColor: colors.backgroundVariant,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                        opacity: 0.6,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 12, color: colors.textVariant }}
                      >
                        {space.address.prefecture.name}
                        {space.address.city}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: colors.primary,
                        marginBottom: 2,
                      }}
                    >
                      {space.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: colors.textVariant,
                        marginBottom: 6,
                      }}
                    >
                      {space.description}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: colors.textVariant,
                        marginBottom: 2,
                      }}
                    >
                      {renderSpacePrice(space.pricePlans)}
                    </Text>
                  </View>
                </Touchable>
              ))}
          </ScrollView>
        </View>
        {/* New Hotels */}
        <View
          style={{
            width: width,
            marginBottom: 12,
            paddingVertical: 12,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 12,
              paddingHorizontal: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "500",
                  fontSize: 18,
                }}
              >
                新着宿泊スペース
              </Text>
            </View>
            <Touchable onPress={() => goToSearch({ searchType: "HOTEL" })}>
              <Text style={{ color: colors.textVariant, fontSize: 12 }}>
                もっと見る
              </Text>
            </Touchable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 6 }}
          >
            {result.data?.allPublishedHotels &&
              result.data?.allPublishedHotels?.length > 0 &&
              result.data?.allPublishedHotels?.map((hotel) => (
                <Touchable key={hotel.id} onPress={() => goToHotel(hotel.id)}>
                  <View
                    key={hotel.id}
                    style={{ marginHorizontal: 6, width: 160 }}
                  >
                    <Image
                      source={{ uri: hotel.photos[0].medium.url }}
                      style={{
                        width: 160,
                        height: 100,
                        borderRadius: 4,
                        marginBottom: 6,
                        backgroundColor: colors.backgroundVariant,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                        opacity: 0.6,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 12, color: colors.textVariant }}
                      >
                        {hotel.address.prefecture.name}
                        {hotel.address.city}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: colors.primary,
                        marginBottom: 2,
                      }}
                    >
                      {hotel.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: colors.textVariant,
                        marginBottom: 6,
                      }}
                    >
                      {hotel.description}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: colors.textVariant,
                        marginBottom: 2,
                      }}
                    >
                      {renderHotelPrice(hotel.packagePlans)}
                    </Text>
                  </View>
                </Touchable>
              ))}
          </ScrollView>
        </View>
        <View
          style={{
            width: width,
            marginTop: 12,
            marginBottom: 12,
            paddingVertical: 12,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 12,
              paddingHorizontal: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                サブスクリプションのご案内
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
            }}
          >
            <SubscriptionBanner onPress={(val) => goToSubscription(val)} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
