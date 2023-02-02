import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Dimensions, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import SpaceCoordinator from "../space-coordinator";
import { useSpace } from "../../../services/graphql";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { FullScreenErrorView } from "../../../widgets/full-screen-error-view";
import {
  Space,
  SpacePricePlan,
  SpacePricePlanType,
} from "../../../services/domains";
import MapView, { Marker, LatLng, Region } from "react-native-maps";
import { Button } from "../../../widgets/button";
import { SVGImage } from "../../../widgets/svg-image";
import { currencyFormatter } from "../../../utils/strings";

export type ISpaceScreenProps = {
  coordinator: SpaceCoordinator;
};

export type ISpaceScreenParams = {
  spaceId: string;
};

const { width } = Dimensions.get("window");
const COVER_IMAGE_WIDTH = width;
const COVER_IMAGE_HEIGHT = Math.floor(COVER_IMAGE_WIDTH / 1.7);
const MAP_WIDTH = width - 24;
const MAP_HEIGHT = Math.floor(MAP_WIDTH / 1.7);

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

export const SpaceScreen: React.FC<ISpaceScreenProps> = ({ coordinator }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [space, setSpace] = useState<Space>();

  const route: RouteProp<{ params: ISpaceScreenParams }> = useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images, strings } = useResources();

  const { spaceById } = useSpace();
  const { spaceId } = route.params;

  const getSpaceById = useCallback(async () => {
    const { data, error } = await spaceById({ variables: { id: spaceId } });
    if (!error) {
      setSpace(data?.spaceById);
    } else {
      setError(error?.message);
    }
    setLoading(false);
  }, []);

  const toReservation = React.useCallback(
    () => coordinator.toSpaceReservation("replace", { spaceId }),
    [spaceId]
  );

  useEffect(() => {
    getSpaceById();
  }, []);

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
    latitude: space?.address.latitude || 35.652832,
    longitude: space?.address.longitude || 139.839478,
  };

  const mapCenter: Region = {
    latitude: addressCoordinates.latitude,
    longitude: addressCoordinates.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const pricePlansDaily: SpacePricePlan[] = [];
  const pricePlansHourly: SpacePricePlan[] = [];
  const pricePlansMinutes: SpacePricePlan[] = [];

  space?.pricePlans.map((plan) => {
    if (plan.type === "DAILY") {
      pricePlansDaily.push(plan);
    } else if (plan.type === "HOURLY") {
      pricePlansHourly.push(plan);
    } else if (plan.type === "MINUTES") {
      pricePlansMinutes.push(plan);
    }
  });

  pricePlansDaily.sort((a, b) => a.duration - b.duration);
  pricePlansHourly.sort((a, b) => a.duration - b.duration);
  pricePlansMinutes.sort((a, b) => a.duration - b.duration);

  const planTypes = [
    { title: "DAILY", label: "日" },
    { title: "HOURLY", label: "時間" },
    { title: "MINUTES", label: "分" },
  ];

  const durationSuffix = (type: SpacePricePlanType) => {
    return planTypes.filter((plan) => plan.title === type)[0].label;
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
          {space?.photos.map((photo) => {
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
            {space?.name}
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: colors.textVariant }}></Text>
              <Text style={{ marginLeft: 4, color: colors.textVariant }}>
                〜{space?.maximumCapacity}人
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginLeft: 8 }}>
              <Text style={{ color: colors.textVariant }}></Text>
              <Text style={{ marginLeft: 4, color: colors.textVariant }}>
                {space?.spaceSize}m²
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginLeft: 8 }}>
              <Text style={{ color: colors.textVariant }}></Text>
              <Text style={{ marginLeft: 4, color: colors.textVariant }}>
                {space?.spaceTypes.map((type) => (
                  <Text key={type.id}>{type.title}</Text>
                ))}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.textVariant }}></Text>
            <Text style={{ marginLeft: 4, color: colors.textVariant }}>
              {space?.address.prefecture.name}
              {space?.address.city}
            </Text>
          </View>
        </View>

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
            スペースについて
          </Text>
          <Text style={{ color: colors.textVariant }}>
            {space?.description}
          </Text>
        </View>

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
                  {space?.address.prefecture.name}
                  {space?.address.city}
                  {space?.address.addressLine1}
                  {space?.address.addressLine1}
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
                {space?.nearestStations.map((station) => {
                  return (
                    <Text
                      key={station.station.id}
                      style={{ color: colors.textVariant }}
                    >
                      {station.station.stationName}駅より{station.via}
                      {station.time}分
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>

          <View>
            <MapView
              minZoomLevel={14}
              maxZoomLevel={20}
              region={mapCenter}
              style={{ width: MAP_WIDTH, height: MAP_HEIGHT, borderRadius: 8 }}
            >
              <Marker
                key={space?.id}
                coordinate={addressCoordinates}
                title={space?.name}
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
              uri: space?.host.profilePhoto?.medium?.url
                ? space?.host.profilePhoto?.medium?.url
                : `https://avatars.dicebear.com/api/identicon/${space?.host.id}.png`,
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
              {space?.host.name}
            </Text>
            <Text style={{ color: colors.textVariant }}>本人確認済み</Text>
          </View>
          <SVGImage
            onPress={() =>
              space?.host.id &&
              coordinator.toChatScreen("navigate", {
                recipientId: space.host.accountId,
                recipientName: space.host.name,
              })
            }
            source={images.svg.ic_message}
            width={50}
            style={{ height: 50, width: 50 }}
          />
        </View>

        {pricePlansMinutes.length > 0 && (
          <View
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
              分対料金プラン
            </Text>
            <View style={{}}>
              {pricePlansMinutes.map((plan, index) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(0,0,0,0.1)",
                    }}
                    key={`${plan.id}-${index}`}
                  >
                    <Text style={{ fontSize: 18, color: colors.textVariant }}>
                      {plan.id}
                    </Text>
                    <Text style={{ fontSize: 18, color: colors.textVariant }}>
                      <Text style={{ fontWeight: "700" }}>
                        {currencyFormatter(plan.amount)}
                      </Text>
                      <Text style={{ fontSize: 14 }}>
                        /{plan.duration}
                        {durationSuffix(plan.type)}
                      </Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {pricePlansHourly.length > 0 && (
          <View
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
              時間対料金プラン
            </Text>
            <View style={{}}>
              {pricePlansHourly.map((plan, index) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(0,0,0,0.1)",
                    }}
                    key={`${plan.id}-${index}`}
                  >
                    <Text style={{ fontSize: 18, color: colors.textVariant }}>
                      {plan.id}
                    </Text>
                    <Text style={{ fontSize: 18, color: colors.textVariant }}>
                      <Text style={{ fontWeight: "700" }}>
                        {currencyFormatter(plan.amount)}
                      </Text>
                      <Text style={{ fontSize: 14 }}>
                        /{plan.duration}
                        {durationSuffix(plan.type)}
                      </Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {pricePlansDaily.length > 0 && (
          <View
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
              日対料金プラン
            </Text>
            <View style={{}}>
              {pricePlansDaily.map((plan, index) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(0,0,0,0.1)",
                    }}
                    key={`${plan.id}-${index}`}
                  >
                    <Text style={{ fontSize: 18, color: colors.textVariant }}>
                      {plan.id}
                    </Text>
                    <Text style={{ fontSize: 18, color: colors.textVariant }}>
                      <Text style={{ fontWeight: "700" }}>
                        {currencyFormatter(plan.amount)}
                      </Text>
                      <Text style={{ fontSize: 14 }}>
                        /{plan.duration}
                        {durationSuffix(plan.type)}
                      </Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

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
