import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import {
  SpaceSearchFilterOptions,
  HotelSearchFilterOptions,
  ISearchScreenProps,
  ISearchScreenParams,
} from "../search-helpers";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { Touchable } from "../../../widgets/touchable";
import { SVGImage } from "../../../widgets/svg-image";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

export const areaList: string[] = [
  "千代田区",
  "中央区",
  "港区",
  "新宿区",
  "文京区",
  "台東区",
  "墨田区",
  "江東区",
  "品川区",
  "目黒区",
  "大田区",
  "世田谷区",
  "渋谷区",
  "中野区",
  "杉並区",
  "豊島区",
  "北区",
  "荒川区",
  "板橋区",
  "練馬区",
  "足立区",
  "葛飾区",
  "江戸川区",
];

export const SearchScreen: React.FC<ISearchScreenProps> = ({ coordinator }) => {
  const [params, setParams] = useState<ISearchScreenParams>();

  const route: RouteProp<{ params: ISearchScreenParams }> = useRoute();
  const headerHeight = useHeaderHeight();
  const { colors } = useResources();

  const updateParams = (data: ISearchScreenParams) => {
    const newParams = { ...params, ...data };
    setParams(newParams);
  };

  useEffect(() => {
    let searchType = route.params.searchType;
    if (!searchType) searchType = "SPACE";
    updateParams({ searchType, adult: 1 });
  }, []);

  const handleSearch = () => {
    const searchType = params?.searchType || "SPACE";
    // Validation
    if (searchType === "SPACE") {
      // validate space search data
      if (!params?.adult || params.adult <= 0) {
        Alert.alert("Invalid no of guests. At least 1 adult is required.");
        return;
      }

      // validation passed
      // prepare data for search result screen props
      const spaceSearchData: SpaceSearchFilterOptions = {
        searchType: "SPACE",
        minPax: params.adult,
      };
      if (params.city) {
        spaceSearchData.city = params.city;
      }
      if (params.checkInDate) {
        spaceSearchData.checkInDate = params.checkInDate;
      }
      // make navigation to search result screen
      coordinator.toSearchResultScreen(spaceSearchData);
    } else {
      // validate hotel search data
      if (!params?.adult || params.adult <= 0) {
        Alert.alert("Invalid no of guests. At least 1 adult is required.");
        return;
      }

      // validate if check out date is greater than check in date
      if (!params.checkInDate || !params.checkOutDate) {
        Alert.alert("Invalid check in or check out date.");
        return;
      }
      if (
        moment(params.checkInDate).isSameOrAfter(moment(params.checkOutDate))
      ) {
        Alert.alert(
          "Invalid check out date. Check out date can not be set before check in date."
        );
        return;
      }

      // validation passed
      // prepare data for search result screen props
      const hotelSearchData: HotelSearchFilterOptions = {
        searchType: "HOTEL",
        adult: params.adult,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
      };
      if (params.city) {
        hotelSearchData.city = params.city;
      }
      // make navigation to search result screen
      coordinator.toSearchResultScreen(hotelSearchData);
    }
    return;
  };

  if (!params) {
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
      <ScrollView keyboardDismissMode="on-drag">
        <View style={{ flexDirection: "row", height: 60, marginBottom: 12 }}>
          <Touchable
            style={{
              backgroundColor: colors.background,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 4,
              borderBottomColor:
                params.searchType === "SPACE"
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
                params.searchType === "HOTEL"
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
        {params.searchType === "HOTEL" ? (
          <HotelSearchForm
            initialValue={params}
            onChange={(data: HotelSearchFilterOptions) => {
              updateParams(data);
            }}
            onSearch={handleSearch}
          />
        ) : (
          <SpaceSearchForm
            initialValue={params}
            onChange={(data: SpaceSearchFilterOptions) => {
              updateParams(data);
            }}
            onSearch={handleSearch}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface SearchFormProps {
  initialValue: ISearchScreenParams;
  onChange: any;
  onSearch: any;
}

const SpaceSearchForm = ({
  initialValue,
  onChange,
  onSearch,
}: SearchFormProps) => {
  const [params, setParams] = useState<SpaceSearchFilterOptions>(initialValue);
  const [showAreaList, setShowAreaList] = useState<boolean>(false);
  const [showGuest, setShowGuest] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const [adult, setAdult] = useState<number>(1);

  useEffect(() => {
    onChange({ ...params, minPax: adult });
  }, [params, adult]);

  const { colors, images } = useResources();

  const updateParams = (data: SpaceSearchFilterOptions) => {
    setParams({ ...params, ...data });
  };

  const handleAreaSelection = (city: string) => {
    updateParams({ city });
    setShowAreaList(false);
  };

  const handleSearch = () => {
    // call search function
    onSearch();
  };

  return (
    <View style={{ backgroundColor: colors.background, paddingHorizontal: 12 }}>
      {/* Area */}
      <View>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowAreaList(!showAreaList);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.map_pin}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              エリア
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              {params.city ? params.city : "エリアを選択"}
            </Text>
          </View>
          {params.city && (
            <Touchable
              onPress={() => {
                updateParams({ city: undefined });
              }}
            >
              <SVGImage
                style={{ width: 20, height: 20, marginRight: 12 }}
                color={colors.textVariant}
                source={images.svg.x_mark}
              />
            </Touchable>
          )}
        </Touchable>
        {showAreaList && (
          <ScrollView
            style={{
              height: "40%",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
            }}
            contentContainerStyle={{ paddingVertical: 6 }}
          >
            {areaList.map((city) => {
              return (
                <Touchable
                  key={city}
                  onPress={() => {
                    handleAreaSelection(city);
                  }}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: colors.textVariant }}>
                    {city}
                  </Text>
                  {params?.city === city && (
                    <SVGImage
                      style={{ width: 16, height: 16, marginLeft: 6 }}
                      color={colors.primary}
                      source={images.svg.check_circle}
                    />
                  )}
                </Touchable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* No of guests */}
      <View>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowGuest(!showGuest);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.users}
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              利用者
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              ゲスト{adult}名
            </Text>
          </View>
        </Touchable>
        {showGuest && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ width: 60 }}>ゲスト</Text>
              <Touchable
                onPress={() => {
                  if (adult > 1) {
                    setAdult(adult - 1);
                  }
                }}
              >
                <SVGImage
                  style={{ width: 24, height: 24 }}
                  color={colors.textVariant}
                  source={images.svg.minus_circle}
                />
              </Touchable>
              <TextInput
                keyboardType="numeric"
                value={`${adult}`}
                onChangeText={(value) => {
                  const newValue = parseInt(value, 10);
                  if (newValue >= 1) {
                    setAdult(newValue);
                  }
                }}
                style={{
                  marginHorizontal: 12,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  width: 60,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  textAlign: "right",
                  fontSize: 18,
                }}
              />
              <Touchable
                onPress={() => {
                  if (adult < 100) {
                    setAdult(adult + 1);
                  }
                }}
              >
                <SVGImage
                  style={{ width: 24, height: 24 }}
                  color={colors.textVariant}
                  source={images.svg.plus_circle}
                />
              </Touchable>
            </View>
          </View>
        )}
      </View>

      {/* Date */}
      <View style={{ width: "100%" }}>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowDate(!showDate);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.calendar_days}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              利用日
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              {params?.checkInDate
                ? moment(params?.checkInDate).format("MM月DD日")
                : "日付を入力"}
            </Text>
          </View>
        </Touchable>
        {showDate && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
              paddingVertical: 12,
            }}
          >
            <DateTimePicker
              value={moment(params.checkInDate).toDate()}
              minimumDate={moment().toDate()}
              themeVariant="light"
              display="spinner"
              onChange={(event, date) => {
                updateParams({
                  checkInDate: moment(date).format("YYYY-MM-DD"),
                });
              }}
            />
          </View>
        )}
      </View>

      {/* Search button */}
      <View style={{ backgroundColor: colors.background, paddingVertical: 12 }}>
        <Touchable
          style={{
            flexDirection: "row",
            padding: 12,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
          onPress={() => {
            handleSearch();
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.background}
            source={images.svg.magnifying_glass}
          />
          <Text
            style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            検索
          </Text>
        </Touchable>
      </View>
    </View>
  );
};

const HotelSearchForm = ({
  initialValue,
  onChange,
  onSearch,
}: SearchFormProps) => {
  const [params, setParams] = useState<HotelSearchFilterOptions>(initialValue);
  const [showAreaList, setShowAreaList] = useState<boolean>(false);
  const [showCheckInDate, setShowCheckInDate] = useState<boolean>(false);
  const [showCheckOutDate, setShowCheckOutDate] = useState<boolean>(false);
  const [showGuest, setShowGuest] = useState<boolean>(false);

  const [adult, setAdult] = useState<number>(initialValue.adult || 1);
  const [child, setChild] = useState<number>(initialValue.child || 0);

  useEffect(() => {
    onChange({ ...params, adult, child });
  }, [params, adult, child]);

  const { colors, images } = useResources();

  const updateParams = (data: HotelSearchFilterOptions) => {
    setParams({ ...params, ...data });
  };

  const handleAreaSelection = (city: string) => {
    updateParams({ city });
    setShowAreaList(false);
  };

  const handleSearch = () => {
    // call search function
    onSearch();
  };

  return (
    <View style={{ backgroundColor: colors.background, paddingHorizontal: 12 }}>
      {/* Area */}
      <View>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowAreaList(!showAreaList);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.map_pin}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              エリア
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              {params.city ? params.city : "エリアを選択"}
            </Text>
          </View>
          {params.city && (
            <Touchable
              onPress={() => {
                updateParams({ city: undefined });
              }}
            >
              <SVGImage
                style={{ width: 20, height: 20, marginRight: 12 }}
                color={colors.textVariant}
                source={images.svg.x_mark}
              />
            </Touchable>
          )}
        </Touchable>
        {showAreaList && (
          <ScrollView
            style={{
              height: "40%",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
            }}
            contentContainerStyle={{ paddingVertical: 6 }}
          >
            {areaList.map((city) => {
              return (
                <Touchable
                  key={city}
                  onPress={() => {
                    handleAreaSelection(city);
                  }}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, color: colors.textVariant }}>
                    {city}
                  </Text>
                  {params?.city === city && (
                    <SVGImage
                      style={{ width: 16, height: 16, marginLeft: 6 }}
                      color={colors.primary}
                      source={images.svg.check_circle}
                    />
                  )}
                </Touchable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Check In Date */}
      <View style={{ width: "100%" }}>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowCheckInDate(!showCheckInDate);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.calendar}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              利用日
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              {params?.checkInDate
                ? moment(params?.checkInDate).format("MM月DD日")
                : "日付を入力"}
            </Text>
          </View>
        </Touchable>
        {showCheckInDate && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
              paddingVertical: 12,
            }}
          >
            <DateTimePicker
              value={moment(params.checkInDate).toDate()}
              minimumDate={moment().toDate()}
              themeVariant="light"
              display="spinner"
              onChange={(event, date) => {
                updateParams({
                  checkInDate: moment(date).format("YYYY-MM-DD"),
                });
              }}
            />
          </View>
        )}
      </View>

      {/* Check Out Date */}
      <View style={{ width: "100%" }}>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowCheckOutDate(!showCheckOutDate);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.calendar_days}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              利用日
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              {params?.checkOutDate
                ? moment(params?.checkOutDate).format("MM月DD日")
                : "日付を入力"}
            </Text>
          </View>
        </Touchable>
        {showCheckOutDate && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
              paddingVertical: 12,
            }}
          >
            <DateTimePicker
              value={moment(params.checkOutDate).toDate()}
              minimumDate={
                params.checkInDate
                  ? moment(params.checkInDate).toDate()
                  : moment().toDate()
              }
              themeVariant="light"
              display="spinner"
              onChange={(event, date) => {
                updateParams({
                  checkOutDate: moment(date).format("YYYY-MM-DD"),
                });
              }}
            />
          </View>
        )}
      </View>

      {/* No of guests */}
      <View>
        <Touchable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            setShowGuest(!showGuest);
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.textVariant}
            source={images.svg.users}
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                color: colors.textVariant,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              利用者
            </Text>
            <Text style={{ fontSize: 14, color: colors.textVariant }}>
              ゲスト{adult + child}名{" "}
              {child > 0 && (
                <Text style={{ color: colors.textVariant, opacity: 0.5 }}>
                  (大人{adult}名・子供{child}名)
                </Text>
              )}
            </Text>
          </View>
        </Touchable>
        {showGuest && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.1)",
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ width: 60 }}>大人</Text>
              <Touchable
                onPress={() => {
                  if (adult > 1) {
                    setAdult(adult - 1);
                  }
                }}
              >
                <SVGImage
                  style={{ width: 24, height: 24 }}
                  color={colors.textVariant}
                  source={images.svg.minus_circle}
                />
              </Touchable>
              <TextInput
                keyboardType="numeric"
                value={`${adult}`}
                onChangeText={(value) => {
                  const newValue = parseInt(value, 10);
                  if (newValue >= 1) {
                    setAdult(newValue);
                  }
                }}
                style={{
                  marginHorizontal: 12,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  width: 60,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  textAlign: "right",
                  fontSize: 18,
                }}
              />
              <Touchable
                onPress={() => {
                  if (adult < 10) {
                    setAdult(adult + 1);
                  }
                }}
              >
                <SVGImage
                  style={{ width: 24, height: 24 }}
                  color={colors.textVariant}
                  source={images.svg.plus_circle}
                />
              </Touchable>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ width: 60 }}>子供</Text>
              <Touchable
                onPress={() => {
                  if (child > 0) {
                    setChild(child - 1);
                  }
                }}
              >
                <SVGImage
                  style={{ width: 24, height: 24 }}
                  color={colors.textVariant}
                  source={images.svg.minus_circle}
                />
              </Touchable>
              <TextInput
                keyboardType="numeric"
                value={`${child}`}
                onChangeText={(value) => {
                  const newValue = parseInt(value, 10);
                  if (newValue >= 1) {
                    setChild(newValue);
                  }
                }}
                style={{
                  marginHorizontal: 12,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  width: 60,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  textAlign: "right",
                  fontSize: 18,
                }}
              />
              <Touchable
                onPress={() => {
                  if (child < 10) {
                    setChild(child + 1);
                  }
                }}
              >
                <SVGImage
                  style={{ width: 24, height: 24 }}
                  color={colors.textVariant}
                  source={images.svg.plus_circle}
                />
              </Touchable>
            </View>
          </View>
        )}
      </View>

      {/* Search button */}
      <View style={{ backgroundColor: colors.background, paddingVertical: 12 }}>
        <Touchable
          style={{
            flexDirection: "row",
            padding: 12,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
          onPress={() => {
            handleSearch();
          }}
        >
          <SVGImage
            style={{ width: 24, height: 24, marginRight: 12 }}
            color={colors.background}
            source={images.svg.magnifying_glass}
          />
          <Text
            style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            検索
          </Text>
        </Touchable>
      </View>
    </View>
  );
};
