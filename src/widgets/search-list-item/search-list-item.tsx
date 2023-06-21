import React from "react";
import { Image, View, Text } from "react-native";
import { useResources } from "../../resources";
import { Touchable } from "../touchable";
import { SVGImage } from "../svg-image";
import { SearchResult } from "../../features/search/search-helpers";
import { SearchCoordinator } from "../../features/search";
import { currencyFormatter } from "../../utils/strings";

type SearchListItemProps = {
  coordinator: SearchCoordinator;
  item: SearchResult;
};

const THUMBNAIL_WIDTH = 100;
const THUMBNAIL_HEIGHT = parseInt(`${THUMBNAIL_WIDTH / 1.3}`, 10);

const SearchListItem: React.FC<SearchListItemProps> = ({
  coordinator,
  item,
}) => {
  const {
    id,
    name,
    prefecture,
    city,
    lat,
    lng,
    maxAdult,
    maxChild,
    price,
    priceUnit,
    thumbnail,
    type,
  } = item;

  const { colors, images } = useResources();

  return (
    <Touchable
      onPress={() => {
        if (type === "HOTEL") {
          // navigate to single hotel with hotel id
          coordinator.toHotelScreen("navigate", { hotelId: item.id });
        } else {
          // navigate to single space with space id
          coordinator.toSpaceScreen("navigate", { spaceId: item.id });
        }
      }}
      key={id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: 12,
      }}
    >
      <Image
        source={{ uri: thumbnail }}
        style={{
          width: THUMBNAIL_WIDTH,
          height: THUMBNAIL_HEIGHT,
          borderRadius: 6,
          marginRight: 12,
          backgroundColor: colors.backgroundVariant,
        }}
      />
      <View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: colors.primary,
            marginBottom: 6,
          }}
        >
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
            opacity: 0.6,
          }}
        >
          <SVGImage
            source={images.svg.map_pin}
            color={colors.textVariant}
            style={{ width: 12, height: 12, marginRight: 3 }}
          />
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, color: colors.textVariant }}
          >
            {prefecture}
            {city}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: colors.text,
            opacity: 0.75,
          }}
        >
          {currencyFormatter(price)}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: colors.textVariant,
            }}
          >
            /{priceUnit}
          </Text>
        </Text>
      </View>
    </Touchable>
  );
};

export default SearchListItem;
