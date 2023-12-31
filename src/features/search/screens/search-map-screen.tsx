import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, Dimensions, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import { Touchable } from "../../../widgets/touchable";
import {
  ISearchScreenParams,
  ISearchScreenProps,
  SearchResult,
} from "../search-helpers";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { FullScreenErrorView } from "../../../widgets/full-screen-error-view";
import { useAlgolia } from "../../../services/algolia";
import { currencyFormatter } from "../../../utils/strings";
import { SVGImage } from "../../../widgets/svg-image";

export const getBoungindBox = (center: Region) => {
  let northeast = {
      latitude: center.latitude + center.latitudeDelta / 2,
      longitude: center.longitude + center.longitudeDelta / 2,
    },
    southwest = {
      latitude: center.latitude - center.latitudeDelta / 2,
      longitude: center.longitude - center.longitudeDelta / 2,
    };
  return [
    northeast.latitude,
    northeast.longitude,
    southwest.latitude,
    southwest.longitude,
  ];
};

const { width } = Dimensions.get("window");

export const SearchMapScreen: React.FC<ISearchScreenProps> = ({
  coordinator,
  isTabScreen,
}) => {
  const [params, setParams] = useState<ISearchScreenParams>({
    searchType: "SPACE",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const [searchResult, setSearchResult] = useState<SearchResult[] | undefined>(
    []
  );

  const headerHeight = useHeaderHeight();
  const { colors, images } = useResources();
  const { spaceIndex, hotelIndex } = useAlgolia();

  let map = useRef<MapView>(null);

  useEffect(() => {
    getLocation();
  }, []);

  // trigger handle change
  useEffect(() => {
    if (!params.boundingBox) {
      (async () => {
        const boundingBox = await getCurrentBoundary();
        if (boundingBox.length > 0) {
          updateParams({
            boundingBox,
          });
        }
      })();
    }
  }, [loading]);

  // Actual Search sideEffect
  useEffect(() => {
    search();
  }, [params]);

  // Search Callback
  const search = useCallback(async () => {
    try {
      if (params.searchType === "SPACE") {
        // Search space index
        const result = await spaceIndex?.search("", params);
        setSearchResult(result?.data);
      } else {
        // Search hotel index
        const result = await hotelIndex?.search("", params);
        setSearchResult(result?.data);
      }
    } catch (error: any) {
      if (
        error.message !==
        'Invalid value for "insideBoundingBox" parameter, expected float for the latitude in the range [-90, 90]'
      )
        Alert.alert(error.message);
    }
  }, [params]);

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("location-access-not-granted");
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    setLocation(location);
    updateParams({
      geoloc: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      },
    });
    setLoading(false);
  };

  const getCurrentBoundary = async (): Promise<number[]> => {
    const boundry = await map?.current?.getMapBoundaries();
    if (!boundry) {
      return [];
    }
    return [
      boundry?.northEast.latitude,
      boundry?.northEast.longitude,
      boundry?.southWest.latitude,
      boundry?.southWest.longitude,
    ];
  };

  const handleRegionChange = async (region: Region) => {
    const boundingBox = await getCurrentBoundary();

    if (boundingBox.length > 0) {
      updateParams({
        boundingBox,
        geoloc: region,
      });
    } else {
      updateParams({ geoloc: region });
    }
  };

  const updateParams = (data: ISearchScreenParams): void => {
    setParams({ ...params, ...data });
  };

  const handleMarkerPress = (mark: SearchResult) => {
    if (mark.type === "SPACE") {
      coordinator.toSpaceScreen("navigate", { spaceId: mark.id });
    } else {
      coordinator.toHotelScreen("navigate", { hotelId: mark.id });
    }
  };

  if (loading) return <FullScreenActivityIndicator />;

  if (errorMessage)
    return (
      <FullScreenErrorView>
        <View
          style={{
            paddingHorizontal: 24,
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {errorMessage === "location-access-not-granted" && (
            <>
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                PocketseQ には、あなたの位置情報にアクセスする権限がありません。
                このアプリの位置情報へのアクセスを許可してください。
              </Text>
            </>
          )}
          {errorMessage !== "location-access-not-granted" && (
            <>
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </Text>
            </>
          )}
        </View>
      </FullScreenErrorView>
    );

  if (!location) {
    console.log("Location vetayena!");
    return (
      <FullScreenErrorView>
        <View
          style={{
            paddingHorizontal: 24,
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.textVariant,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            アドレスの読み込み中にエラーが発生しました。
          </Text>
          <Touchable onPress={getLocation}>
            <Text
              style={{
                color: colors.textVariant,
                fontSize: 16,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              リロード
            </Text>
          </Touchable>
        </View>
      </FullScreenErrorView>
    );
  }
  return (
    <SafeAreaView
      edges={isTabScreen ? ["left", "right"] : ["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.backgroundVariant,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      {isTabScreen && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 18,
            paddingHorizontal: 12,
            backgroundColor: colors.primary,
          }}
        >
          <SVGImage
            source={images.svg.map_pin}
            color={colors.background}
            style={{ width: 24, height: 24, marginRight: 12 }}
          />
          <Text
            style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            現在地から探す
          </Text>
        </View>
      )}
      <View style={{ position: "relative", flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map}
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={params?.geoloc}
          key={`map_key_${location?.timestamp | 1}`}
          showsUserLocation
          onRegionChangeComplete={(region) => {
            handleRegionChange(region);
          }}
        >
          {searchResult && searchResult.length > 0 && (
            <>
              {searchResult.map((result, index) => {
                return (
                  <Marker
                    style={{ overflow: "visible" }}
                    key={result.id}
                    coordinate={{ latitude: result.lat, longitude: result.lng }}
                    onPress={() => {
                      handleMarkerPress(result);
                    }}
                    zIndex={index + 1}
                  >
                    <Touchable>
                      <CustomMarker result={result} />
                    </Touchable>
                  </Marker>
                );
              })}
            </>
          )}
        </MapView>
        <View
          style={{
            position: "absolute",
            height: 60,
            width: width - 24,
            top: 12,
            left: 12,
            backgroundColor: colors.background,
            flexDirection: "row",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Touchable
            style={{
              backgroundColor: colors.background,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 4,
              borderBottomColor:
                params?.searchType === "SPACE"
                  ? colors.primary
                  : colors.background,
              paddingTop: 4,
            }}
            onPress={() => {
              updateParams({ searchType: "SPACE" });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
              }}
            >
              レンタルスペース
            </Text>
          </Touchable>
          <Touchable
            style={{
              backgroundColor: colors.background,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 4,
              borderBottomColor:
                params?.searchType === "HOTEL"
                  ? colors.primary
                  : colors.background,
              paddingTop: 4,
            }}
            onPress={() => {
              updateParams({ searchType: "HOTEL" });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
              }}
            >
              宿泊
            </Text>
          </Touchable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CustomMarker: React.FC<{ result: SearchResult }> = ({ result }) => {
  const { colors } = useResources();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
        position: "relative",
        overflow: "visible",
      }}
    >
      <Text
        style={{ color: colors.textVariant, fontWeight: "700", fontSize: 18 }}
      >
        {currencyFormatter(result.price)}
      </Text>
    </View>
  );
};
