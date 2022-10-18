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
          Selected Plan
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
            <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
              Plan Description
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "200" }}>
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
          Selected Room
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
            <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
              Room Description
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "200" }}>
              {selectedRoom?.hotelRoom?.description || ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={[commonStyles(colors)]}>
        <Text
          style={{ fontSize: 18, fontWeight: "700", color: colors.textVariant }}
        >
          Date
        </Text>

        <View style={[globalStyles.row, { marginTop: 10 }]}>
          <View
            style={[
              globalStyles.col_6,
              {
                justifyContent: "center",
                alignItems: "center",
                borderWidth: StyleSheet.hairlineWidth,
                borderRightWidth: 1,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                paddingVertical: 10,
                borderColor: colors.secondaryVariant,
                borderRadius: 10,
              },
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
              Check In
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

          <View
            style={[
              globalStyles.col_6,
              {
                justifyContent: "center",
                alignItems: "center",
                borderWidth: StyleSheet.hairlineWidth,
                borderLeftWidth: 1,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,

                paddingVertical: 10,
                borderColor: colors.secondaryVariant,
                borderRadius: 10,
              },
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
              Check Out
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
            fontSize: 16,
            fontWeight: "700",
            color: colors.textVariant,
            marginRight: 14,
            marginBottom: 14,
          }}
        >
          Number of Peoples
        </Text>
        <View style={[globalStyles.row, { width: "100%" }]}>
          <View style={[globalStyles.col_6]}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              Adults
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
          <View style={[globalStyles.col_6]}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.textVariant,
                marginRight: 14,
              }}
            >
              Childs
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
          Price
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
              Calculating Fees ...
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
              Hotel unavailable for the choosen details
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
                <Text
                  style={{ fontSize: 18, fontWeight: "700", letterSpacing: 2 }}
                >
                  {Math.ceil(priceDate?.totalAmount / 1.1) || "0"}
                </Text>
              </View>
            </View>

            <View style={[globalStyles.row, { marginVertical: 14 }]}>
              <View style={[globalStyles.row, globalStyles.col_6]}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>Tax </Text>
              </View>

              <View
                style={[
                  globalStyles.row,
                  globalStyles.col_6,
                  { justifyContent: "flex-end" },
                ]}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "700", letterSpacing: 2 }}
                >
                  {Math.ceil(
                    priceDate?.totalAmount - priceDate?.totalAmount / 1.1
                  ) || "0"}
                </Text>
              </View>
            </View>

            <View style={[globalStyles.row, { marginVertical: 14 }]}>
              <View style={[globalStyles.row, globalStyles.col_6]}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>Total </Text>
              </View>

              <View
                style={[
                  globalStyles.row,
                  globalStyles.col_6,
                  { justifyContent: "flex-end" },
                ]}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "700", letterSpacing: 2 }}
                >
                  {Math.ceil(priceDate?.totalAmount) || "0"}
                </Text>
              </View>
            </View>

            <Button
              title="Confirm"
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
