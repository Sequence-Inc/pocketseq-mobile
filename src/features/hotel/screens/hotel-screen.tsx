import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Dimensions, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import HotelCoordinator from "../hotel-coordinator";
import { useHotel } from "../../../services/graphql";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { FullScreenErrorView } from "../../../widgets/full-screen-error-view";
import { Touchable } from "../../../widgets/touchable";
import {
  Hotel,
  HotelBuildingType,
  HotelPackagePlanRoomType,
  PaymentTerm,
} from "../../../services/domains";
import MapView, {
  Marker,
  LatLng,
  Region,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { Button } from "../../../widgets/button";
import { SVGImage } from "../../../widgets/svg-image";
import { currencyFormatter } from "../../../utils/strings";

export type ISpaceScreenProps = {
  coordinator: HotelCoordinator;
};

export type IHotelScreenParams = {
  hotelId: string;
};

const { width } = Dimensions.get("window");
const COVER_IMAGE_WIDTH = width;
const COVER_IMAGE_HEIGHT = Math.floor(COVER_IMAGE_WIDTH / 1.7);
const MAP_WIDTH = width - 24;
const MAP_HEIGHT = Math.floor(MAP_WIDTH / 1.7);
const IMAGE_WIDTH = Math.floor(width * 0.55);
const IMAGE_HEIGHT = Math.floor(IMAGE_WIDTH / 1.3);

const DEMO_REVIEW = [
  {
    name: "Yusaku",
    photo: {
      url: "https://dev.pocketseq.com/review.jpg",
    },
    createdAt: "2021年6月",
    comment: "立地も良く､清潔感のある宿で満足できるかと思います!",
  },
  {
    name: "Takayuki",
    photo: {
      url: "https://dev.pocketseq.com/review.jpg",
    },
    createdAt: "2021年6月",
    comment:
      "施設はとても綺麗で､ｷｯﾁﾝやｱﾒﾆﾃｨも充実しています｡ ｿﾌﾄﾊﾞﾝｸ携帯の電波が入らない点が難点でしたが､滞在はとても満足しています｡",
  },
  {
    name: "高橋",
    photo: {
      url: "https://dev.pocketseq.com/review.jpg",
    },
    createdAt: "2021年6月",
    comment:
      "非常に満足です｡ 対応も設備も文句なし｡ 素晴らしい非日常を味わうことができました｡ 何も不自由することなく楽しめましたので 是非利用してみてください｡",
  },
];

export const HotelScreen: React.FC<ISpaceScreenProps> = ({ coordinator }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [hotel, setHotel] = useState<Hotel>();

  const route: RouteProp<{ params: IHotelScreenParams }> = useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images } = useResources();

  const { hotelById } = useHotel();
  const { hotelId } = route.params;

  const getHotelById = useCallback(async () => {
    const { data, error } = await hotelById({ variables: { id: hotelId } });
    if (!error) {
      setHotel(data?.hotelById);
    } else {
      setError(error?.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getHotelById();
  }, []);

  const toReservation = React.useCallback(
    () => coordinator.toHotelReservation("replace", { hotelId }),
    [hotelId]
  );

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (error) {
    return (
      <FullScreenErrorView edges={["bottom", "left", "right"]}>
        <Text
          style={{ fontSize: 16, fontWeight: "700", color: colors.textVariant }}
        >
          {error || `There was an error!`}
        </Text>
      </FullScreenErrorView>
    );
  }

  const addressCoordinates: LatLng = {
    latitude: hotel?.address.latitude || 35.652832,
    longitude: hotel?.address.longitude || 139.839478,
  };

  const mapCenter: Region = {
    latitude: addressCoordinates.latitude,
    longitude: addressCoordinates.longitude,
    latitudeDelta: 0.009991524946315167,
    longitudeDelta: 0.02093397080898285,
  };

  const renderHotelBuildingType = (type: HotelBuildingType | undefined) => {
    const buildingTypes = {
      HOTEL: "ホテル",
      WHOLE_HOUSE: "一棟貸し",
      SIMPLE_ACCOMODATION: "簡易宿泊",
      INN: "旅館",
    };
    if (!type) {
      return null;
    }
    return buildingTypes[type];
  };

  const getCheapPlanPrice = (
    packagePlans: HotelPackagePlanRoomType[],
    paymentTerm: PaymentTerm
  ) => {
    let min = 9999999999;
    const priceSelector =
      paymentTerm === "PER_PERSON" ? "oneAdultCharge" : "roomCharge";
    packagePlans.map((plan) => {
      plan.priceSettings.map((price) => {
        if (price.priceScheme[priceSelector] < min) {
          min = price.priceScheme[priceSelector];
        }
      });
    });
    return min;
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.backgroundVariant }}
        keyboardDismissMode="on-drag"
      >
        {/* Cover Images Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={{ width: COVER_IMAGE_WIDTH, height: COVER_IMAGE_HEIGHT }}
        >
          {hotel?.photos.map((photo) => {
            return (
              <View
                key={photo.id}
                style={{ backgroundColor: colors.backgroundVariant }}
              >
                <Image
                  source={{ uri: photo.large.url }}
                  style={{
                    width: COVER_IMAGE_WIDTH,
                    height: COVER_IMAGE_HEIGHT,
                  }}
                />
              </View>
            );
          })}
        </ScrollView>

        {/* Title and information */}
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            {hotel?.name}
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {/* No of rooms */}
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: colors.textVariant }}></Text>
              <Text style={{ marginLeft: 4, color: colors.textVariant }}>
                {hotel?.rooms.length}寝室
              </Text>
            </View>

            {/* Is pet Allowed? */}
            {hotel?.isPetAllowed && (
              <View style={{ flexDirection: "row", marginLeft: 8 }}>
                <Text style={{ color: colors.textVariant }}></Text>
                <Text style={{ marginLeft: 4, color: colors.textVariant }}>
                  ペット可
                </Text>
              </View>
            )}

            {/* Building type */}
            <View style={{ flexDirection: "row", marginLeft: 8 }}>
              <Text style={{ color: colors.textVariant }}></Text>
              <Text style={{ marginLeft: 4, color: colors.textVariant }}>
                {renderHotelBuildingType(hotel?.buildingType)}
              </Text>
            </View>
          </View>

          {/* Short address */}
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.textVariant }}></Text>
            <Text style={{ marginLeft: 4, color: colors.textVariant }}>
              {hotel?.address.prefecture.name}
              {hotel?.address.city}
            </Text>
          </View>
        </View>

        {/* Space description */}
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textVariant,
              marginBottom: 18,
            }}
          >
            {renderHotelBuildingType(hotel?.buildingType)}について
          </Text>
          <Text style={{ color: colors.textVariant }}>
            {hotel?.description}
          </Text>
        </View>

        {/* Plans */}
        <View
          style={{
            backgroundColor: colors.background,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              paddingHorizontal: 12,
              color: colors.textVariant,
              marginBottom: 18,
            }}
          >
            プラン一覧
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{ paddingHorizontal: 6 }}
          >
            {hotel?.packagePlans.map((plan) => {
              return (
                <View
                  key={plan.id}
                  style={{
                    marginHorizontal: 6,
                    padding: 6,
                    paddingBottom: 12,
                    borderRadius: 12,
                    backgroundColor: colors.backgroundVariant,
                  }}
                >
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    nestedScrollEnabled
                    style={{
                      width: IMAGE_WIDTH,
                      marginBottom: 12,
                      borderRadius: 8,
                    }}
                  >
                    {plan.photos.map((photo) => {
                      return (
                        <Image
                          key={photo.id}
                          source={{ uri: photo.large.url }}
                          style={{
                            backgroundColor: colors.backgroundVariant,
                            width: IMAGE_WIDTH,
                            height: IMAGE_HEIGHT,
                          }}
                        />
                      );
                    })}
                  </ScrollView>
                  <View style={{ paddingHorizontal: 6 }}>
                    <Text
                      style={{
                        color: colors.textVariant,
                        marginBottom: 6,
                        fontSize: 18,
                        fontWeight: "700",
                      }}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ color: colors.textVariant, marginBottom: 6 }}
                    >
                      {plan.description}
                    </Text>
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 20,
                        fontWeight: "700",
                      }}
                    >
                      {currencyFormatter(
                        getCheapPlanPrice(plan.roomTypes, plan.paymentTerm)
                      )}
                      <Text style={{ fontSize: 14, fontWeight: "500" }}>
                        /泊
                      </Text>
                    </Text>
                    {/* <Touchable>
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          paddingHorizontal: 24,
                          paddingVertical: 12,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: "700",
                            color: colors.background,
                          }}
                        >
                          予約
                        </Text>
                      </View>
                    </Touchable> */}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Rooms and beds */}
        <View
          style={{
            backgroundColor: colors.background,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              paddingHorizontal: 12,
              color: colors.textVariant,
              marginBottom: 18,
            }}
          >
            寝室・ベッドについて
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{ paddingHorizontal: 6 }}
          >
            {hotel?.rooms.map((room) => {
              return (
                <View
                  key={room.id}
                  style={{
                    marginHorizontal: 6,
                    padding: 6,
                    paddingBottom: 12,
                    borderRadius: 12,
                    backgroundColor: colors.backgroundVariant,
                  }}
                >
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    nestedScrollEnabled
                    style={{ width: IMAGE_WIDTH, marginBottom: 12 }}
                  >
                    {room.photos.map((photo) => {
                      return (
                        <Image
                          key={photo.id}
                          source={{ uri: photo.large.url }}
                          style={{
                            backgroundColor: colors.backgroundVariant,
                            width: IMAGE_WIDTH,
                            height: IMAGE_HEIGHT,
                            borderRadius: 8,
                          }}
                        />
                      );
                    })}
                  </ScrollView>
                  <View style={{ paddingHorizontal: 6 }}>
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 18,
                        fontWeight: "700",
                        marginBottom: 6,
                      }}
                    >
                      {room.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ color: colors.textVariant }}
                    >
                      {room.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Address, Access & Location */}
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <View style={{ marginBottom: 18 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
                marginBottom: 18,
              }}
            >
              アクセス
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <View style={{ width: 60, marginRight: 12 }}>
                <Text style={{ color: colors.textVariant, fontWeight: "700" }}>
                  住所
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textVariant }}>
                  {hotel?.address.prefecture.name}
                  {hotel?.address.city}
                  {hotel?.address.addressLine1}
                  {hotel?.address.addressLine1}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 60, marginRight: 12 }}>
                <Text style={{ color: colors.textVariant, fontWeight: "700" }}>
                  最寄り駅
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                {hotel?.nearestStations.map((station) => {
                  return (
                    <Text
                      key={station.station.id}
                      style={{ color: colors.textVariant }}
                    >
                      {station.station.stationName}駅より{station.accessType}
                      {station.time}分
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Google map */}
          <View>
            <MapView
              provider={PROVIDER_GOOGLE}
              minZoomLevel={0}
              maxZoomLevel={20}
              region={mapCenter}
              style={{ width: MAP_WIDTH, height: MAP_HEIGHT, borderRadius: 8 }}
            >
              <Marker
                key={hotel?.id}
                coordinate={addressCoordinates}
                title={hotel?.name}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.25)",
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                    }}
                  ></View>
                </View>
              </Marker>
            </MapView>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <Image
            source={{
              uri: hotel?.host.profilePhoto?.medium?.url
                ? hotel?.host.profilePhoto?.medium?.url
                : `https://avatars.dicebear.com/api/identicon/${hotel?.host.id}.png`,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              backgroundColor: colors.backgroundVariant,
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {hotel?.host.name}
            </Text>
            <Text style={{ color: colors.textVariant }}>本人確認済み</Text>
          </View>
          <SVGImage
            onPress={() =>
              hotel?.host.accountId &&
              coordinator.toChatScreen("navigate", {
                recipientId: hotel.host.accountId,
                recipientName: hotel.host.name,
              })
            }
            source={images.svg.ic_message}
            style={{ height: 50, width: 50 }}
            color={colors.primary}
          />
        </View>

        {/* Review */}
        {/* <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingTop: 18,
            paddingBottom: 5,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textVariant,
              marginBottom: 18,
            }}
          >
            4.52（99件のレビュー）
          </Text>
          <View style={{}}>
            {DEMO_REVIEW.map((review, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 18,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(0,0,0,0.1)",
                  }}
                  key={`${index}`}
                >
                  <Image
                    source={{ uri: review.photo.url }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 40,
                      marginRight: 12,
                      backgroundColor: colors.backgroundVariant,
                    }}
                  />
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    <View
                      style={{
                        flexDirection: "column",
                        height: 40,
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: colors.textVariant,
                        }}
                      >
                        {review.name}
                      </Text>
                      <Text style={{ color: colors.textVariant }}>
                        {review.createdAt}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, color: colors.textVariant }}>
                        {review.comment}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View> */}
      </ScrollView>

      <Button
        containerStyle={{
          backgroundColor: colors.primary,
          borderRadius: 0,
          height: 55,
          padding: 0,
        }}
        loading={loading}
        onPress={toReservation}
        titleStyle={{
          color: colors.background,
          fontSize: 18,
          fontWeight: "600",
        }}
        title="予約"
      />
    </SafeAreaView>
  );
};
