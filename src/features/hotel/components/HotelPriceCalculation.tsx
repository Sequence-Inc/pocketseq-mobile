import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { Picker } from "@react-native-picker/picker";
import { styleStore } from "../../../services/storage";
import { TextInput } from "../../../widgets/text-input";

import { observer } from "mobx-react";
import { useResources } from "../../../resources";
import { DatePicker } from "../../../widgets/datepicker";
import { useCalculateHotelPrice } from "../../../services/graphql";
import { Button } from "../../../widgets/button";

const commonStyles = (colors: any) => ({
  backgroundColor: colors.background,
  paddingHorizontal: 12,
  paddingVertical: 18,
  marginBottom: 12,
});

export const HotelPriceCalculation = ({
  plans,
  currentPlan,
  reserve,
}: {
  plans: any;
  currentPlan: any;
  reserve: any;
}) => {
  const [{ globalStyles }] = useState(() => styleStore);
  const { colors } = useResources();
  const [startDate, setStartDate] = useState<Moment>(moment().endOf("day"));
  const [endDate, setEndDate] = useState<Moment>(
    moment().add(1, "day").endOf("day")
  );
  const [selectedPlan, setSelectedPlan] = useState();
  const [selectedRoom, setSelectedRoom] = useState();
  const [noOfAdults, setNoOfAdults] = useState<null | string>("1");
  const [noOfChild, setNoOfChild] = useState<null | string>("0");
  const [noOfNight, setNoOfNight] = useState<number>();

  const {
    fetchHotelPrice,
    calculatingPrice,
    priceCalculationError,
    priceDate,
  } = useCalculateHotelPrice();

  const disabledDateCheckout = () => {
    if (startDate) {
      return startDate.add(1, "day").endOf("day").toDate();
    } else {
      return moment().endOf("day").toDate();
    }
  };

  const makeReservation = () => {
    if (
      startDate &&
      endDate &&
      noOfAdults &&
      selectedRoom &&
      selectedPlan &&
      priceDate &&
      noOfNight
    ) {
      reserve({
        startDate: startDate?.unix(),
        endDate: endDate?.unix(),
        noOfAdults,
        noOfChild: noOfChild || 0,
        roomPlanId: selectedRoom?.id,
        room: selectedRoom,
        plan: selectedPlan,
        price: priceDate?.totalAmount,
        noOfNight,
      });
    }
  };
  useEffect(() => {
    if (plans?.length) {
      setSelectedPlan(plans[0]);
    }
    if (plans?.length && plans[0]?.roomTypes.length) {
      setSelectedRoom(plans[0]?.roomTypes[0]);
    }
  }, [plans]);

  useEffect(() => {
    if (startDate && endDate) {
      const noOfNights = endDate
        .endOf("day")
        .diff(startDate.startOf("day"), "days");
      setNoOfNight(noOfNights);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (currentPlan) {
      setSelectedPlan(currentPlan);
    }
  }, [currentPlan]);

  useEffect(() => {
    // get price
    if (
      startDate &&
      endDate &&
      selectedPlan &&
      selectedRoom &&
      parseInt(noOfAdults || "1") >= 1 &&
      parseInt(noOfChild || "0") >= 0
    ) {
      fetchHotelPrice({
        selectedRoom,
        startDate,
        endDate,
        noOfAdults: parseInt(noOfAdults || "1"),
        noOfChild: parseInt(noOfChild || "0"),
        // roomPlanId: selectedRoom.id,
        // checkInDate: startDate?.startOf("day").valueOf(),
        // checkOutDate: endDate?.startOf("day").valueOf(),
        // nAdult: noOfAdults,
        // nChild: noOfChild,
      });
    }
  }, [selectedRoom, startDate, endDate, noOfAdults, noOfChild]);

  return (
    <>
      <View style={[commonStyles(colors), { marginBottom: 12 }]}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.textVariant,
            marginRight: 14,
          }}
        >
          プラン選択
        </Text>
        <View style={[globalStyles.row]}>
          <Picker
            style={[globalStyles.col_12]}
            mode="dialog"
            placeholder="Select Category"
            selectedValue={selectedPlan?.id}
            onValueChange={(itemValue) => {
              const item = plans?.find((item) => item.id === itemValue);
              setSelectedPlan(item);
            }}
          >
            {plans?.map((plan: any) => {
              return (
                <Picker.Item
                  key={plan?.id}
                  label={plan?.name?.toString()}
                  value={plan?.id}
                />
              );
            })}
          </Picker>

          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
                color: colors.textVariant,
              }}
            >
              選択したプラン
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
              }}
            >
              {selectedPlan?.name || ""}
            </Text>
            <Text style={{ fontSize: 16, color: colors.textVariant }}>
              {selectedPlan?.description || ""}
            </Text>
          </View>
        </View>
      </View>
      <View style={[commonStyles(colors)]}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.textVariant,
            marginRight: 14,
          }}
        >
          ルーム選択
        </Text>
        <View style={[globalStyles.row]}>
          <Picker
            style={[globalStyles.col_12]}
            mode="dialog"
            placeholder="Select Category"
            selectedValue={selectedRoom?.id}
            onValueChange={(itemValue) => {
              const item = selectedPlan?.roomTypes?.find(
                (item) => item.id === itemValue
              );
              setSelectedRoom(item);
            }}
          >
            {selectedPlan?.roomTypes?.map((roomType: any) => {
              return (
                <Picker.Item
                  key={roomType?.id}
                  label={roomType.hotelRoom.name?.toString()}
                  value={roomType?.id}
                />
              );
            })}
          </Picker>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
                color: colors.textVariant,
              }}
            >
              選択したルーム
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
              }}
            >
              {selectedRoom?.hotelRoom?.name || ""}
            </Text>
            <Text style={{ fontSize: 16, color: colors.textVariant }}>
              {selectedRoom?.hotelRoom?.description || ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={[commonStyles(colors)]}>
        <Text
          style={{ fontSize: 18, fontWeight: "700", color: colors.textVariant }}
        >
          予定日
        </Text>

        <View style={[globalStyles.row, { marginTop: 10 }]}>
          <View style={{ flexGrow: 1, marginRight: 8 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              チェックイン
            </Text>

            <DatePicker
              mode="date"
              onChange={(val: any) => {
                setStartDate(val?.startOf("day"));
              }}
              date={startDate}
              // minimumValue={moment().endOf("day").toDate()}
              // maximumValue={endDate.toDate()}
            />
          </View>

          <View style={{ flexGrow: 1, marginLeft: 8 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              チェックアウト
            </Text>

            <DatePicker
              mode="date"
              onChange={(val: any) => {
                setEndDate(val?.endOf("day"));
              }}
              date={endDate}
              // minimumValue={startDate.add(1, "day").endOf("day").toDate()}
            />
          </View>
        </View>
      </View>
      <View style={[commonStyles(colors)]}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: colors.textVariant,
            marginBottom: 14,
          }}
        >
          人数
        </Text>
        <View style={[globalStyles.row, { width: "100%" }]}>
          <View style={[{ flexGrow: 1, marginRight: 8 }]}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              大人
            </Text>
            <TextInput
              containerStyle={[globalStyles.col_12]}
              keyboardType="number-pad"
              value={noOfAdults?.toString()}
              onChangeText={(val) => {
                setNoOfAdults(val);
              }}
              onEndEditing={(val) => {
                if (!val.nativeEvent.text.length) setNoOfAdults("1");
              }}
            />
          </View>
          <View style={[{ flexGrow: 1, marginLeft: 8 }]}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              子供
            </Text>
            <TextInput
              containerStyle={[globalStyles.col_12]}
              keyboardType="number-pad"
              value={noOfChild?.toString() || ""}
              onChangeText={(val) => {
                setNoOfChild(val);
              }}
              onEndEditing={(val) => {
                if (!val.nativeEvent.text.length) setNoOfChild("0");
              }}
            />
          </View>
        </View>
      </View>

      <View style={[commonStyles(colors)]}>
        <Text
          style={{ fontSize: 20, fontWeight: "700", color: colors.textVariant }}
        >
          料金
        </Text>

        {calculatingPrice && (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.textVariant,
                marginVertical: 14,
              }}
            >
              ...
            </Text>
          </View>
        )}
        {!calculatingPrice && priceCalculationError && (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: colors.textVariant,
                marginVertical: 14,
              }}
            >
              選択した日付は利用できません。
            </Text>
          </View>
        )}

        {!calculatingPrice && !priceCalculationError && noOfNight && (
          <>
            <View style={[globalStyles.row, { marginVertical: 14 }]}>
              <View style={[globalStyles.row, globalStyles.col_6]}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>
                  {" "}
                  大人 {noOfAdults}{" "}
                </Text>
                {parseInt(noOfChild || "0") > 0 && (
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    {" "}
                    ・子供 {noOfChild}{" "}
                  </Text>
                )}
                <Text style={{ fontSize: 15, fontWeight: "600" }}>
                  x {noOfNight || "0"}泊
                </Text>
              </View>

              <View
                style={[
                  globalStyles.row,
                  globalStyles.col_6,
                  { justifyContent: "flex-end" },
                ]}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  ￥{Math.ceil(priceDate?.totalAmount / 1.1) || "0"}
                </Text>
              </View>
            </View>

            <View style={[globalStyles.row, { marginVertical: 14 }]}>
              <View style={[globalStyles.row, globalStyles.col_6]}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>税金</Text>
              </View>

              <View
                style={[
                  globalStyles.row,
                  globalStyles.col_6,
                  { justifyContent: "flex-end" },
                ]}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  ￥
                  {Math.ceil(
                    priceDate?.totalAmount - priceDate?.totalAmount / 1.1
                  ) || "0"}
                </Text>
              </View>
            </View>

            <View style={[globalStyles.row, { marginVertical: 14 }]}>
              <View style={[globalStyles.row, globalStyles.col_6]}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>合計</Text>
              </View>

              <View
                style={[
                  globalStyles.row,
                  globalStyles.col_6,
                  { justifyContent: "flex-end" },
                ]}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  ￥{Math.ceil(priceDate?.totalAmount) || "0"}
                </Text>
              </View>
            </View>

            <Button
              title="次へ"
              onPress={makeReservation}
              containerStyle={{
                backgroundColor: colors.primary,
                borderRadius: 12,
              }}
              titleStyle={{ color: "#fff", fontSize: 18, letterSpacing: 2 }}
            />
          </>
        )}
      </View>
    </>
  );
};
