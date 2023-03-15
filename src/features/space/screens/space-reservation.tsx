import React, { useState } from "react";
import { ScrollView, Dimensions, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpaceCoordinator, {
  TTO_SPACE_RESERVAION_PROPS,
} from "../space-coordinator";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useSpace } from "../../../services/graphql";
import { styleStore } from "../../../services/storage";
import moment, { Moment } from "moment";
import { Picker } from "@react-native-picker/picker";

import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { FullScreenErrorView } from "../../../widgets/full-screen-error-view";
import { useResources } from "../../../resources";
import { useHeaderHeight } from "@react-navigation/elements";
import { observer } from "mobx-react";
import { Button } from "../../../widgets/button";

import { DatePicker } from "../../../widgets/datepicker";
import useApplicablePricePlans from "../../../services/graphql/hooks/space/use-applicable-price";
import {
  getEndDateTime,
  getStartDateTime,
} from "../../../services/graphql/hooks/utility";
import { currencyFormatter } from "../../../utils/strings";

export type ISpaceReservationProps = {
  coordinator: SpaceCoordinator;
};

type TDefaultSettings = {
  id?: string;
  totalStock?: string;
  isDefault?: string;
  closed?: string;
  businessDays?: string;
  openingHr?: string;
  closingHr?: string;
  breakFromHr?: string;
  breakToHr?: string;
  fromDate?: string;
  toDate?: string;
};
type DurationType = "DAILY" | "HOURLY" | "MINUTES";

const DurationTypeString = { DAILY: "日", HOURLY: "時間", MINUTES: "分" };

const options = {
  DAILY: Array.from({ length: 30 }).map((_, index) => index + 1),
  HOURLY: Array.from({ length: 24 }).map((_, index) => index + 1),
  MINUTES: [5, 10, 15, 30, 45],
};

const { width } = Dimensions.get("window");
const COVER_IMAGE_WIDTH = width;
const COVER_IMAGE_HEIGHT = Math.floor(COVER_IMAGE_WIDTH / 1.7);

const SpaceReservation: React.FC<ISpaceReservationProps> = ({
  coordinator,
}) => {
  const {
    fetchSpaceById,
    loading: fetchingSpace,
    error,
    data: space,
  } = useSpace();
  const { colors, strings } = useResources();
  const [{ globalStyles }] = React.useState(styleStore);
  const headerHeight = useHeaderHeight();
  const [start, setStart] = useState<Moment>(moment(new Date()));
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  const [startDateTime, setStartDateTime] = useState<Moment>();
  const [endDateTime, setEndDateTime] = useState<Moment>();
  const [defaultSettings, setDefaultSettings] = useState<TDefaultSettings>();
  const [availableHours, setAvailableHours] = useState<number[]>();

  const [duration, setDuration] = useState(options["DAILY"][0]);
  const [durationType, setDurationType] = useState<DurationType>("DAILY");
  const [durationOptions, setDurationOptions] = useState(options["DAILY"]);

  const [showCheckInTime, setShowCheckInTime] = useState(false);

  const {
    fetchApplicatblePricePlans,
    loading: fetchingApplicablePricePlans,
    data: applicablePricePlans,
    error: fetchApplicablePricePlanErrors,
  } = useApplicablePricePlans();

  const {
    params: { spaceId },
  }: RouteProp<{ params: TTO_SPACE_RESERVAION_PROPS }> = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      fetchSpaceById(spaceId);
    }, [spaceId])
  );

  React.useEffect(() => {
    if (defaultSettings) {
      const unwantedHours = [
        defaultSettings?.breakFromHr,
        defaultSettings?.breakToHr,
      ].filter((item) => !!item);
      let tempWantedHours = [];

      for (
        let i = Number(defaultSettings?.openingHr || 0);
        i < Number(defaultSettings?.closingHr || 24);
        i++
      ) {
        tempWantedHours.push(i);
      }

      tempWantedHours = tempWantedHours.filter(
        (item: any) => !unwantedHours.includes(item)
      );
      setAvailableHours([...tempWantedHours]);
    }
  }, [defaultSettings]);

  React.useEffect(() => {
    setDurationOptions(options[durationType]);
    if (durationType === "MINUTES") {
      if (
        duration !== 5 &&
        duration !== 10 &&
        duration !== 15 &&
        duration !== 30 &&
        duration !== 45
      ) {
        setDuration(5);
      }
    } else if (durationType === "HOURLY" && duration > 24) {
      setDuration(1);
    } else if (durationType === "DAILY" && duration > 30) {
      setDuration(1);
    }
  }, [durationType]);

  React.useEffect(() => {
    if (start) {
      setStartDateTime(getStartDateTime(start, durationType, hour, minute));
    }
  }, [start, duration, durationType, hour, minute]);

  React.useEffect(() => {
    if (durationType === "HOURLY" || durationType === "MINUTES") {
      setShowCheckInTime(true);
    } else {
      setShowCheckInTime(false);
    }
  });

  React.useEffect(() => {
    if (space?.settings?.length) {
      setDefaultSettings(
        space?.settings?.find((setting) => !!setting.isDefault)
      );
    }
  }, [space]);

  React.useEffect(() => {
    if (startDateTime) {
      const endDateTime = getEndDateTime(startDateTime, duration, durationType);
      setEndDateTime(endDateTime);

      if (durationType === "DAILY") {
        fetchApplicatblePricePlans({
          fromDateTime: startDateTime.unix() * 1000,
          duration,
          durationType,
          spaceId,
        });
      } else if (endDateTime) {
        fetchApplicatblePricePlans({
          fromDateTime: startDateTime.unix() * 1000,
          duration,
          durationType,
          spaceId,
        });
      }
    }
  }, [startDateTime, duration, durationType, spaceId]);

  const toConfirmation = React.useCallback(
    () =>
      coordinator.toSpaceReserveConfirm("replace", {
        spaceId,
        duration,
        durationType,
        fromDateTime: 1000 * (startDateTime?.unix() || 0),
      }),
    [spaceId, duration, duration, startDateTime]
  );

  if (fetchingSpace) {
    return <FullScreenActivityIndicator />;
  }

  if (error) {
    return (
      <FullScreenErrorView>
        <View>
          <Text>Opps! Something went wrong.</Text>
        </View>
      </FullScreenErrorView>
    );
  }

  const initialPricingDetail = () => {
    let content = <Text>Not enough infomation!</Text>;

    if (applicablePricePlans) {
      const total = applicablePricePlans?.total;
      const duration = applicablePricePlans?.duration;
      const durationType = applicablePricePlans?.durationType;
      const plans = applicablePricePlans?.applicablePricePlans;
      const taxableAmount = total / 1.1;
      const pricePlans = plans as any[];

      content = (
        <>
          <View
            style={{
              backgroundColor: colors.background,
              paddingHorizontal: 12,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 20 }}>
              プラン
            </Text>
            {pricePlans?.map((plan, index) => {
              const {
                title,
                amount,
                appliedTimes,
                duration,
                type,
                isOverride,
              } = plan;

              return (
                <View
                  key={index}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.surfaceVariant,
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <View
                    style={[
                      globalStyles.row,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <View>
                      <Text
                        style={{
                          color: colors.textVariant,
                          fontSize: 14,
                        }}
                      >
                        {title}
                      </Text>
                      {isOverride && (
                        <Text
                          style={{ color: colors.textVariant, fontSize: 14 }}
                        >
                          (Override price)
                        </Text>
                      )}
                      <Text
                        style={{
                          color: colors.surface,
                          fontSize: 18,
                          fontWeight: "700",
                          marginTop: 6,
                        }}
                      >
                        {currencyFormatter(amount)}/{duration}
                        {DurationTypeString[type]}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: colors.primary,
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      {appliedTimes}回
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View
            style={[
              {
                backgroundColor: colors.background,
                paddingHorizontal: 12,
                paddingVertical: 18,
                marginBottom: 12,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textVariant,
                marginBottom: 12,
              }}
            >
              料金内容
            </Text>
            <View
              style={[
                globalStyles.row,
                globalStyles.col_12,
                { flex: 1, marginBottom: 12, justifyContent: "space-between" },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                時間
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                {duration} {DurationTypeString[durationType]}
              </Text>
            </View>

            <View
              style={[
                globalStyles.row,
                globalStyles.col_12,
                { flex: 1, marginBottom: 12, justifyContent: "space-between" },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                }}
              >
                小計
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                {currencyFormatter(Math.ceil(taxableAmount))}
              </Text>
            </View>

            <View
              style={[
                globalStyles.row,
                globalStyles.col_12,
                { flex: 1, marginBottom: 12, justifyContent: "space-between" },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                税金
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                {currencyFormatter(Math.ceil(total - taxableAmount))}
              </Text>
            </View>

            <View
              style={[
                globalStyles.row,
                globalStyles.col_12,
                {
                  flex: 1,
                  marginBottom: 12,
                  justifyContent: "space-between",
                  marginTop: 12,
                  borderTopWidth: 1,
                  paddingVertical: 10,
                  borderTopColor: colors.surfaceVariant,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                合計
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginRight: 14,
                }}
              >
                {currencyFormatter(total)}
              </Text>
            </View>
          </View>
        </>
      );
    }
    return content;
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
        style={{
          flex: 1,
          backgroundColor: colors.backgroundVariant,
        }}
        nestedScrollEnabled={true}
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
          {space?.photos.map((photo) => {
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

        {/* Calclulating price ui starts */}

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
              fontSize: 19,
              fontWeight: "700",
              color: colors.textVariant,
              marginBottom: 12,
            }}
          >
            予約内容
          </Text>

          <View
            style={[
              {
                marginBottom: 12,
                flexDirection: "row",
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
                flex: 1,
              }}
            >
              チェックイン:
            </Text>
            <View style={{ flex: 1 }}>
              <DatePicker
                mode="date"
                onChange={(val: any) => setStart(val)}
                date={start}
                minimumValue={moment().add(1, "day").endOf("day").toDate()}
              />
            </View>
          </View>

          <View style={[{ marginBottom: 12 }]}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              期間
            </Text>
            <View style={[globalStyles.row]}>
              <Picker
                style={[globalStyles.col_3]}
                mode="dialog"
                placeholder="Select Category"
                selectedValue={duration}
                onValueChange={(itemValue) => {
                  setDuration(itemValue);
                }}
              >
                {durationOptions.map((_) => {
                  return <Picker.Item key={_} label={_.toString()} value={_} />;
                })}
              </Picker>

              <Picker
                style={[globalStyles.col_6]}
                mode="dialog"
                placeholder="Select Category"
                selectedValue={durationType}
                onValueChange={(itemValue) => {
                  setDurationType(itemValue);
                }}
              >
                <Picker.Item key={"DAILY"} label={"日"} value={"DAILY"} />
                <Picker.Item key={"HOURLY"} label={"時間"} value={"HOURLY"} />
                <Picker.Item key={"MINUTES"} label={"分"} value={"MINUTES"} />
              </Picker>
            </View>
          </View>

          {showCheckInTime && (
            <View style={[{ marginBottom: 12 }]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textVariant,
                  marginBottom: 12,
                }}
              >
                チェックイン時間:
              </Text>

              <View style={[globalStyles.row]}>
                <>
                  <Picker
                    style={[globalStyles.col_3]}
                    mode="dialog"
                    placeholder="Select Category"
                    selectedValue={hour}
                    onValueChange={(itemValue) => {
                      setHour(itemValue);
                    }}
                  >
                    {availableHours?.map((value) => (
                      <Picker.Item
                        key={value}
                        label={value.toString()}
                        value={value}
                      />
                    ))}
                  </Picker>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.textVariant,
                      marginBottom: 12,
                    }}
                  >
                    時
                  </Text>
                </>

                <>
                  <Picker
                    style={[globalStyles.col_4]}
                    mode="dialog"
                    placeholder="Select Category"
                    selectedValue={minute}
                    onValueChange={(itemValue) => {
                      setMinute(itemValue);
                    }}
                    itemStyle={{ paddingLeft: 10 }}
                  >
                    <Picker.Item value="0" label="0" key="0" />
                    <Picker.Item value="5" label="5" key="5" />
                    <Picker.Item value="10" label="10" key="10" />
                    <Picker.Item value="15" label="15" key="15" />
                    <Picker.Item value="20" label="20" key="20" />
                    <Picker.Item value="25" label="25" key="25" />
                    <Picker.Item value="30" label="30" key="30" />
                    <Picker.Item value="35" label="35" key="35" />
                    <Picker.Item value="40" label="40" key="40" />
                    <Picker.Item value="45" label="45" key="45" />
                    <Picker.Item value="50" label="50" key="50" />
                    <Picker.Item value="55" label="55" key="55" />
                  </Picker>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.textVariant,
                      marginBottom: 12,
                    }}
                  >
                    分
                  </Text>
                </>
              </View>
            </View>
          )}
        </View>

        <>
          {fetchApplicablePricePlanErrors && (
            <Text
              style={{
                fontWeight: "700",
                color: colors.textVariant,
                padding: 12,
                paddingTop: 0,
              }}
            >
              選択した予定日このスペースは空いてません。
            </Text>
          )}

          {applicablePricePlans && <>{initialPricingDetail()}</>}
        </>
      </ScrollView>

      <View
        style={[
          globalStyles.row,
          {
            minHeight: 20,
            justifyContent: "center",
          },
        ]}
      >
        {fetchApplicablePricePlanErrors && (
          <Button
            containerStyle={{
              backgroundColor: colors.primary,
              borderRadius: 0,
            }}
            titleStyle={{ color: colors.error, fontSize: 18 }}
            title={`予約不可`}
            loading={fetchingApplicablePricePlans}
            // onPress={fetchApplicatblePricePlans}
          />
        )}
        {!fetchApplicablePricePlanErrors && (
          <Button
            containerStyle={{
              backgroundColor: colors.primary,
              borderRadius: 0,
            }}
            titleStyle={{
              color: colors.background,
              fontSize: 18,
            }}
            title={`次へ`}
            loading={fetchingApplicablePricePlans}
            onPress={toConfirmation}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export const SpaceReservationScreen = observer(SpaceReservation);
