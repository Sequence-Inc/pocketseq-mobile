import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Platform,
  Text,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import { Touchable } from "../../../widgets/touchable";
import {
  ISearchScreenParams,
  ISearchScreenProps,
  SearchResult,
} from "../search-helpers";
import MapView, { Marker, LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { FullScreenErrorView } from "../../../widgets/full-screen-error-view";
import { currencyFormatter } from "../../../widgets/search-list-item/search-list-item";
import { useAlgolia } from "../../../services/algolia";

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

const { width, height } = Dimensions.get("window");

export const SearchMapScreen: React.FC<ISearchScreenProps> = ({
  coordinator,
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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("Permission to access location was denied");
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
    })();
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

  if (errorMessage) return <FullScreenErrorView />;

  if (!location) {
    return <FullScreenActivityIndicator />;
  }

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.backgroundVariant,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <View style={{ position: "relative", flex: 1 }}>
        <MapView
          ref={map}
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={params?.geoloc}
          provider="google"
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
