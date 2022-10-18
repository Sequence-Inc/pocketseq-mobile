import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Switch } from "react-native";
import { useResources } from "../../resources";
import { Touchable } from "../touchable";
import { SVGImage } from "../svg-image";
import { Picker } from "../picker";
import {
  HotelSearchFilterOptions,
  SpaceSearchFilterOptions,
} from "../../features/search/search-helpers";
import {
  HotelBuildingType,
  hotelBuildingTypes,
  hotelBuildingTypeArray,
  filterPaxGroupMap,
  filterPaxGroup,
  FilterPaxGroup,
  SpaceType,
} from "../../services/domains";
import { useSpace } from "../../services/graphql";
import { FullScreenActivityIndicator } from "../full-screen-activity-indicator";
import { FullScreenErrorView } from "../full-screen-error-view";
import { currencyFormatter } from "../search-list-item/search-list-item";
import Slider from "@react-native-community/slider";

type SearchHeaderItemProps = {
  filters: SpaceSearchFilterOptions & HotelSearchFilterOptions;
  onChange: (data: SpaceSearchFilterOptions & HotelSearchFilterOptions) => void;
  hits: number;
};

const SearchHeaderItem: React.FC<SearchHeaderItemProps> = ({
  filters,
  onChange,
  hits,
}) => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [showHotelAdults, setShowHotelAdults] = useState<boolean>(false);
  const [showSpaceAdults, setShowSpaceAdults] = useState<boolean>(false);
  const [spaceAdultType, setSpaceAdultType] = useState<string>("NONE");
  const [showBuildingType, setShowBuildingType] = useState<boolean>(false);
  const [showSpaceType, setShowSpaceType] = useState<boolean>(false);
  const [showPrice, setShowPrice] = useState<boolean>(false);

  const { searchType } = filters;

  const { colors, images } = useResources();
  const { getAvailableSpaceTypes } = useSpace();

  const getData = useCallback(async () => {
    const { data, error } = await getAvailableSpaceTypes();
    if (!error) {
      setSpaceTypes(data?.availableSpaceTypes);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }
  if (error) {
    return <FullScreenErrorView />;
  }

  return (
    <View
      style={{
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.background,
          padding: 12,
          flex: 1,
        }}
      >
        <Text
          style={{
            flexGrow: 1,
            fontSize: 18,
            fontWeight: "800",
            color: colors.textVariant,
          }}
        >
          {hits}件を超える{searchType === "SPACE" ? "スペース" : "宿泊先"}
        </Text>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.backgroundVariant,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.1)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 4,
          }}
          onPress={() => {
            setShowFilters(!showFilters);
          }}
        >
          <SVGImage
            source={images.svg.adjustment_horizontal}
            color={colors.textVariant}
            style={{ width: 18, height: 18, marginRight: 6 }}
          />
          <Text style={{ fontWeight: "700", color: colors.textVariant }}>
            フィルタ
          </Text>
        </Touchable>
      </View>
      {showFilters && (
        <View
          style={{
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: "rgba(0,0,0,0.1)",
            backgroundColor: colors.background,
          }}
        >
          <Text
            style={{
              color: colors.textVariant,
              fontWeight: "800",
              marginBottom: 12,
              fontSize: 16,
            }}
          >
            {searchType === "SPACE" ? "スペース" : "宿泊"}フィルタ
          </Text>

          {searchType === "SPACE" && (
            <View>
              {/* Price Range */}
              <View style={{ minHeight: 34, marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.textVariant,
                      flexGrow: 1,
                      fontSize: 16,
                    }}
                  >
                    料金
                  </Text>
                  <Touchable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(250,250,250,1)",
                      borderWidth: 1,
                      borderColor: "rgba(230,230,230,1)",
                      height: 34,
                    }}
                    onPress={() => {
                      setShowPrice(!showPrice);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 16,
                        lineHeight: 20,
                        textAlign: "right",
                        flexGrow: 1,
                        opacity: 0.8,
                      }}
                    >
                      {filters.price && filters.minPrice ? (
                        <>
                          {currencyFormatter(filters.minPrice)} 〜{" "}
                          {currencyFormatter(filters.price)}
                        </>
                      ) : (
                        <>
                          <Text>指定なし</Text>
                        </>
                      )}
                    </Text>
                    <SVGImage
                      source={images.svg.chevron_down}
                      color={colors.textVariant}
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 4,
                        opacity: 0.8,
                      }}
                    />
                  </Touchable>
                </View>
                {showPrice && (
                  <View style={{ marginTop: 12 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: colors.textVariant,
                          flexGrow: 1,
                          fontSize: 16,
                        }}
                      >
                        最低価格
                      </Text>
                      <Text
                        style={{
                          color: colors.textVariant,
                          fontWeight: "700",
                          fontSize: 16,
                        }}
                      >
                        {currencyFormatter(filters.minPrice || 0)}
                      </Text>
                    </View>
                    <Slider
                      style={{ height: 40 }}
                      minimumValue={0}
                      maximumValue={50000}
                      minimumTrackTintColor={colors.backgroundVariant}
                      maximumTrackTintColor={colors.primary}
                      step={100}
                      value={filters.minPrice || 0}
                      onSlidingComplete={(value) => {
                        if (value < (filters.price || 50000)) {
                          onChange({ minPrice: value });
                        }
                      }}
                    />
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: colors.textVariant,
                          flexGrow: 1,
                          fontSize: 16,
                        }}
                      >
                        最高価格
                      </Text>
                      <Text
                        style={{
                          color: colors.textVariant,
                          fontWeight: "700",
                          fontSize: 16,
                        }}
                      >
                        {currencyFormatter(filters.price || 50000)}
                      </Text>
                    </View>
                    <Slider
                      style={{ height: 40 }}
                      minimumValue={0}
                      maximumValue={50000}
                      minimumTrackTintColor={colors.primary}
                      maximumTrackTintColor={colors.backgroundVariant}
                      step={100}
                      value={filters.price || 50000}
                      onSlidingComplete={(value) => {
                        if (value > (filters.minPrice || 0)) {
                          onChange({ price: value });
                        }
                      }}
                    />
                  </View>
                )}
              </View>

              {/* No of Adults */}
              <View style={{ minHeight: 34, marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.textVariant,
                      flexGrow: 1,
                      fontSize: 16,
                    }}
                  >
                    人数
                  </Text>
                  <Touchable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(250,250,250,1)",
                      borderWidth: 1,
                      borderColor: "rgba(230,230,230,1)",
                      height: 34,
                    }}
                    onPress={() => {
                      setShowSpaceAdults(!showSpaceAdults);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 16,
                        lineHeight: 20,
                        textAlign: "right",
                        flexGrow: 1,
                        opacity: 0.8,
                      }}
                    >
                      {spaceAdultType && filterPaxGroupMap[spaceAdultType]}
                    </Text>
                    <SVGImage
                      source={images.svg.chevron_down}
                      color={colors.textVariant}
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 4,
                        opacity: 0.8,
                      }}
                    />
                  </Touchable>
                </View>
                {showSpaceAdults && (
                  <View style={{ marginTop: 12 }}>
                    <Picker
                      items={filterPaxGroup}
                      selectedItem={spaceAdultType}
                      renderItem={(
                        item: FilterPaxGroup,
                        selectedItem: string,
                        onSelect: any
                      ) => {
                        let selected = false;
                        if (item.type !== "NONE" && item.type === selectedItem)
                          selected = true;
                        return (
                          <Touchable
                            onPress={() => onSelect(item)}
                            key={item.type}
                            style={{
                              borderTopWidth: 1,
                              borderTopColor: "rgba(240,240,240,1)",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              height: 36,
                            }}
                          >
                            <Text
                              style={[
                                { fontSize: 16 },
                                {
                                  color: selected
                                    ? colors.primary
                                    : colors.textVariant,
                                },
                              ]}
                            >
                              {item.name}
                            </Text>
                            {selected && (
                              <SVGImage
                                source={images.svg.check_circle}
                                color={colors.primary}
                                style={{ height: 16, width: 16, marginLeft: 4 }}
                              />
                            )}
                          </Touchable>
                        );
                      }}
                      onSelect={(item: FilterPaxGroup) => {
                        if (item.type !== "NONE") {
                          if (item.min && item.max) {
                            setSpaceAdultType(item.type);
                            onChange({ minPax: item.min, maxPax: item.max });
                            return;
                          }
                        }
                        setSpaceAdultType(item.type);
                        onChange({ minPax: undefined, maxPax: undefined });
                      }}
                      containerStyle={{ maxHeight: 160 }}
                    />
                  </View>
                )}
              </View>

              {/* Space Type */}
              <View style={{ minHeight: 34, marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.textVariant,
                      flexGrow: 1,
                      fontSize: 16,
                    }}
                  >
                    利用目的
                  </Text>
                  <Touchable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(250,250,250,1)",
                      borderWidth: 1,
                      borderColor: "rgba(230,230,230,1)",
                      height: 34,
                    }}
                    onPress={() => {
                      setShowSpaceType(!showSpaceType);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 16,
                        lineHeight: 20,
                        textAlign: "right",
                        flexGrow: 1,
                        opacity: 0.8,
                      }}
                    >
                      {filters.spaceType || "指定なし"}
                    </Text>
                    <SVGImage
                      source={images.svg.chevron_down}
                      color={colors.textVariant}
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 4,
                        opacity: 0.8,
                      }}
                    />
                  </Touchable>
                </View>
                {showSpaceType && (
                  <View style={{ marginTop: 12 }}>
                    <Picker
                      items={[{ id: "NONE", title: "指定なし" }, ...spaceTypes]}
                      selectedItem={filters.spaceType}
                      renderItem={(
                        item: SpaceType,
                        selectedItem: string,
                        onSelect: any
                      ) => {
                        let selected = false;
                        if (item.title === selectedItem) selected = true;
                        return (
                          <Touchable
                            onPress={() => onSelect(item)}
                            key={item.id}
                            style={{
                              borderTopWidth: 1,
                              borderTopColor: "rgba(240,240,240,1)",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              height: 36,
                            }}
                          >
                            <Text
                              style={[
                                { fontSize: 16 },
                                {
                                  color: selected
                                    ? colors.primary
                                    : colors.textVariant,
                                },
                              ]}
                            >
                              {item.title}
                            </Text>
                            {selected && (
                              <SVGImage
                                source={images.svg.check_circle}
                                color={colors.primary}
                                style={{ height: 16, width: 16, marginLeft: 4 }}
                              />
                            )}
                          </Touchable>
                        );
                      }}
                      onSelect={(item: SpaceType) => {
                        if (item.id !== "NONE") {
                          onChange({ spaceType: item.title });
                          return;
                        }
                        onChange({ spaceType: undefined });
                      }}
                      containerStyle={{ maxHeight: 160 }}
                    />
                  </View>
                )}
              </View>
            </View>
          )}

          {searchType === "HOTEL" && (
            <View>
              {/* Breakfast */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  minHeight: 34,
                }}
              >
                <Text
                  style={{
                    color: colors.textVariant,
                    flexGrow: 1,
                    fontSize: 16,
                  }}
                >
                  朝食付き
                </Text>
                <Switch
                  onValueChange={(value) => {
                    onChange({ breakfast: value });
                  }}
                  value={filters.breakfast || false}
                />
              </View>

              {/* Building Type */}
              <View style={{ minHeight: 34, marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.textVariant,
                      flexGrow: 1,
                      fontSize: 16,
                    }}
                  >
                    建物タイプ
                  </Text>
                  <Touchable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 100,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(250,250,250,1)",
                      borderWidth: 1,
                      borderColor: "rgba(230,230,230,1)",
                      height: 34,
                    }}
                    onPress={() => {
                      setShowBuildingType(!showBuildingType);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 16,
                        lineHeight: 20,
                        textAlign: "right",
                        flexGrow: 1,
                        opacity: 0.8,
                      }}
                    >
                      {filters.buildingType &&
                        hotelBuildingTypes[filters.buildingType]}
                    </Text>
                    <SVGImage
                      source={images.svg.chevron_down}
                      color={colors.textVariant}
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 4,
                        opacity: 0.8,
                      }}
                    />
                  </Touchable>
                </View>
                {showBuildingType && (
                  <View style={{ marginTop: 12 }}>
                    <Picker
                      items={[
                        { type: "NONE", name: "指定なし" },
                        ...hotelBuildingTypeArray,
                      ]}
                      selectedItem={filters.buildingType || null}
                      renderItem={(
                        item: { type: HotelBuildingType; name: string },
                        selectedItem: HotelBuildingType,
                        onSelect: any
                      ) => {
                        let selected = false;
                        if (item.type === selectedItem) selected = true;
                        return (
                          <Touchable
                            onPress={() => onSelect(item.type)}
                            key={item.type}
                            style={{
                              borderTopWidth: 1,
                              borderTopColor: "rgba(240,240,240,1)",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              height: 36,
                            }}
                          >
                            <Text
                              style={[
                                { fontSize: 16 },
                                {
                                  color: selected
                                    ? colors.primary
                                    : colors.textVariant,
                                },
                              ]}
                            >
                              {item.name}
                            </Text>
                            {selected && (
                              <SVGImage
                                source={images.svg.check_circle}
                                color={colors.primary}
                                style={{ height: 16, width: 16, marginLeft: 4 }}
                              />
                            )}
                          </Touchable>
                        );
                      }}
                      onSelect={(item: HotelBuildingType | "NONE") => {
                        if (item === "NONE") {
                          onChange({ buildingType: undefined });
                        } else {
                          onChange({ buildingType: item });
                        }
                      }}
                      containerStyle={{ maxHeight: 160 }}
                    />
                  </View>
                )}
              </View>

              {/* Pets */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  minHeight: 34,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: colors.textVariant,
                    flexGrow: 1,
                    fontSize: 16,
                  }}
                >
                  ペット可
                </Text>
                <Switch
                  onValueChange={(value) => {
                    onChange({ pet: value });
                  }}
                  value={filters.pet || false}
                />
              </View>

              {/* No of Adults */}
              <View style={{ minHeight: 34, marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.textVariant,
                      flexGrow: 1,
                      fontSize: 16,
                    }}
                  >
                    人数
                  </Text>
                  <Touchable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 100,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(250,250,250,1)",
                      borderWidth: 1,
                      borderColor: "rgba(230,230,230,1)",
                      height: 34,
                    }}
                    onPress={() => {
                      setShowHotelAdults(!showHotelAdults);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textVariant,
                        fontSize: 16,
                        textAlign: "right",
                        flexGrow: 1,
                        opacity: 0.8,
                      }}
                    >
                      {filters.adult || 1}人
                    </Text>
                    <SVGImage
                      source={images.svg.chevron_down}
                      color={colors.textVariant}
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 4,
                        opacity: 0.8,
                      }}
                    />
                  </Touchable>
                </View>
                {showHotelAdults && (
                  <View style={{ marginTop: 12 }}>
                    <Picker
                      items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      selectedItem={filters.adult}
                      renderItem={(
                        item: number,
                        selectedItem: number,
                        onSelect: any
                      ) => {
                        let selected = false;
                        if (item === selectedItem) selected = true;
                        return (
                          <Touchable
                            onPress={() => onSelect(item)}
                            key={item}
                            style={{
                              borderTopWidth: 1,
                              borderTopColor: "rgba(240,240,240,1)",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                { fontSize: 16 },
                                {
                                  color: selected
                                    ? colors.primary
                                    : colors.textVariant,
                                },
                              ]}
                            >
                              {item}名
                            </Text>
                            {item === selectedItem && (
                              <SVGImage
                                source={images.svg.check_circle}
                                color={colors.primary}
                                style={{ height: 16, width: 16, marginLeft: 4 }}
                              />
                            )}
                          </Touchable>
                        );
                      }}
                      onSelect={(item: number) => {
                        onChange({ adult: item as number });
                      }}
                      containerStyle={{ maxHeight: 160 }}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default SearchHeaderItem;
