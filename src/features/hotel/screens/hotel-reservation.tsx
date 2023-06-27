import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useState } from "react";
import { ScrollView, Dimensions, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import HotelCoordinator, { ReserveHotelParams } from "../hotel-coordinator";
import { useHotelQuery } from "../../../services/graphql";

import { HotelPriceCalculation } from "../components/HotelPriceCalculation";
import { IHotelScreenParams } from "./hotel-screen";

const { width } = Dimensions.get("window");
const COVER_IMAGE_WIDTH = width;
const COVER_IMAGE_HEIGHT = Math.floor(COVER_IMAGE_WIDTH / 1.7);

export type IHotelReservationProps = {
  coordinator: HotelCoordinator;
};

export const HotelReservation: React.FC<IHotelReservationProps> = ({
  coordinator,
}) => {
  const route: RouteProp<{ params: IHotelScreenParams }> = useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images } = useResources();
  const { hotelId } = route.params;
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { fetchHotelById, loading, error, hotel } = useHotelQuery();

  const reserve = (data: ReserveHotelParams) =>
    coordinator.toHotelReserveConfirm("navigate", { ...data });

  useFocusEffect(
    React.useCallback(() => {
      if (hotelId) {
        fetchHotelById(hotelId);
      }
    }, [hotelId])
  );

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
        <ScrollView
          horizontal
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={{
            width: COVER_IMAGE_WIDTH,
            height: COVER_IMAGE_HEIGHT,
            flex: 1,
          }}
        >
          {hotel?.photos.map((photo) => {
            return (
              <View
                key={photo.id}
                style={{ backgroundColor: colors.backgroundVariant, flex: 1 }}
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

        <>
          <HotelPriceCalculation
            plans={hotel?.packagePlans}
            currentPlan={selectedPlan}
            reserve={reserve}
          />
        </>
      </ScrollView>
    </SafeAreaView>
  );
};
