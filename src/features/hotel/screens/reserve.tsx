import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import HotelCoordinator, { ReserveHotelParams } from "../hotel-coordinator";
import {
  // useHotelQuery,
  useReserveHotel,
  OptionsType,
  useCalculatePriceWithOptions,
  useFetchSubscriptions,
} from "../../../services/graphql";
import { Picker } from "@react-native-picker/picker";
import {
  OPTION_PAYMENT_TERMS,
  HOTEL_SUBSCRIPTION_CATEGORIES,
} from "../../../widgets/app-config";
import { Checkbox } from "../../../widgets/checkbox";
import { SelectPayment } from "../../../widgets/payment-method";
import { observer } from "mobx-react";
import { SessionStore, styleStore } from "../../../services/storage";
import moment from "moment";
import { Button } from "../../../widgets/button";

import { Subscription } from "../../../widgets/my-subscriptions";
import {
  currencyFormatter,
  hoursAsCancelPolicyDuration,
} from "../../../utils/strings";
import { Touchable } from "../../../widgets/touchable";

export type IHotelConfirmationProps = {
  coordinator: HotelCoordinator;
};

const ReserveHotel: React.FC<IHotelConfirmationProps> = ({ coordinator }) => {
  const { params }: RouteProp<{ params: ReserveHotelParams }> = useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images } = useResources();

  const [selectedPayment, setPaymentSource] = React.useState<null | any>(null);

  const [{ globalStyles }] = React.useState(() => styleStore);

  const [{ accessToken }] = React.useState(() => SessionStore);

  // const [{ canUseSubscription }] = React.useState(() => HotelReservationStore);

  const {
    plan,
    room,
    roomPlanId,
    startDate,
    endDate,
    noOfAdults,
    noOfChild,
    noOfNight,
  } = params;

  const [useSubscription, setSubscription] = useState<boolean>(false);

  const { subscription, fetchingSubscriptions, fetchingSubscriptionError } =
    useFetchSubscriptions();

  const hasHotelSubscriptions = React.useMemo(() => {
    if (subscription?.mySubscriptions?.length) {
      return subscription?.mySubscriptions?.find(
        (subscription: any) => subscription?.type === "hotel"
      );
    }
  }, [subscription]);

  const {
    additionalOptionsFields,
    onAdditionalOptionsCheckboxAction,
    onAdditionalFieldChangeQuantity,
    includedOptions,
    setValue,
    handleHotelReservation,
    reservingHotel,
    reservedHotelSuccessData,
    reserveHotelError,
  } = useReserveHotel({
    plan: plan.id,
    roomPlanId: roomPlanId,
    nAdult: Number(noOfAdults),
    nChild: Number(noOfChild),
    checkInDate: startDate,
    checkOutDate: endDate,
  });

  const {
    fetchCalculatedPrice,
    calculatingPrice,
    fetchCalculatePriceWithAuth,
    priceData,
    loading,
    priceCalculationError,
  } = useCalculatePriceWithOptions();

  React.useEffect(() => {
    if (!params) return;
    let calculatePriceInput = {
      roomPlanId,
      nAdult: Number(noOfAdults),
      nChild: Number(noOfChild),
      checkInDate: moment(1000 * Number(startDate)),
      checkOutDate: moment(1000 * Number(endDate)),
      additionalOptionsFields: additionalOptionsFields,
    };

    if (
      accessToken &&
      (hasHotelSubscriptions?.amount > HOTEL_SUBSCRIPTION_CATEGORIES.B ||
        hasHotelSubscriptions?.amount > plan?.subcriptionPrice)
    ) {
      fetchCalculatePriceWithAuth({
        ...calculatePriceInput,
        useSubscription: useSubscription,
      });
    } else {
      fetchCalculatedPrice(calculatePriceInput);
    }
  }, [
    params,
    accessToken,
    plan,
    useSubscription,
    additionalOptionsFields,
    fetchCalculatedPrice,
    fetchCalculatePriceWithAuth,
  ]);

  const handleReservation = useCallback(async () => {
    // setProgressModalVisibility(true);

    const input = {
      roomPlanId,
      checkInDate: moment(Number(startDate) * 1000)
        ?.startOf("day")
        .valueOf(),
      checkOutDate: moment(Number(endDate) * 1000)
        ?.startOf("day")
        .valueOf(),
      nAdult: Number(noOfAdults),
      nChild: Number(noOfChild),
      additionalOptions: additionalOptionsFields
        .filter((option: any) => option?.isChecked)
        ?.map((option: any) => ({
          optionId: option?.id,
          quantity: option?.quantity,
        })),
      useSubscription: !!useSubscription,
      paymentSourceId: selectedPayment?.id,
    };

    const data = await handleHotelReservation(input);

    if (data.data) {
      Alert.alert("Successfully reserved hotel room");
    }
    if (data.errors) {
      Alert.alert("Opps. Something went wrong");
    }
  }, [
    roomPlanId,
    selectedPayment,
    startDate,
    endDate,
    noOfAdults,
    noOfChild,
    additionalOptionsFields,
    useSubscription,
    handleHotelReservation,
  ]);

  const taxCalculated = priceData?.totalAmount
    ? Math.ceil(
        priceData?.totalAmount - Math.ceil(priceData?.totalAmount / 1.1)
      )
    : 0;

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
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>予約</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginBottom: 12,
          }}
        >
          <View
            style={[
              globalStyles.row,
              globalStyles.mb10,
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              },
            ]}
          >
            <Text>プラン</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {plan?.name}
            </Text>
          </View>

          <View
            style={[
              globalStyles.row,
              globalStyles.mb10,
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              },
            ]}
          >
            <Text>ルーム</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {room?.hotelRoom?.name}
            </Text>
          </View>

          <View
            style={[
              globalStyles.row,
              globalStyles.mb10,
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              },
            ]}
          >
            <Text>予約期間</Text>
            <View
              style={[
                globalStyles.row,
                globalStyles.col_12,
                { justifyContent: "space-between" },
              ]}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {moment(Number(startDate) * 1000).format("YYYY年MM月DD日")}〜
                {moment(Number(endDate) * 1000).format("YYYY年MM月DD日")}
              </Text>
            </View>
          </View>
          <View
            style={[
              globalStyles.row,
              globalStyles.mb10,
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              },
            ]}
          >
            <Text>人数</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {Number(noOfAdults) + Number(noOfChild)}
            </Text>
          </View>
        </View>

        {includedOptions?.length > 0 && (
          <View
            style={{
              backgroundColor: colors.background,
              paddingHorizontal: 12,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              付属オプション
            </Text>

            {includedOptions?.length < 1 ? (
              <View style={{ marginVertical: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  オプションはありません。
                </Text>
              </View>
            ) : (
              <></>
            )}
            {includedOptions?.length > 0 ? (
              includedOptions.map((options: OptionsType, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      borderBottomColor: colors.secondaryVariant,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {options?.name || ""}
                    </Text>
                    <Text
                      style={{ fontSize: 12, letterSpacing: 1, lineHeight: 17 }}
                    >
                      {options?.description || ""}
                    </Text>
                  </View>
                );
              })
            ) : (
              <></>
            )}
          </View>
        )}
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
            オプションの追加
          </Text>

          {additionalOptionsFields?.length < 1 ? (
            <View style={{ marginVertical: 12 }}>
              <Text style={{ fontSize: 16 }}>オプションはありません。</Text>
            </View>
          ) : (
            <></>
          )}

          {additionalOptionsFields?.length > 0 &&
            additionalOptionsFields.map(
              (additionalField: any, additionalFieldIndex: number) => {
                const paymentTerm = OPTION_PAYMENT_TERMS.find(
                  (terms: any) => terms.value === additionalField?.paymentTerm
                )?.label;
                return (
                  <View
                    key={additionalField?.additionalOptionFieldId}
                    style={{
                      flex: 1,
                      borderBottomColor: colors.secondaryVariant,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View style={[globalStyles.row]}>
                      <View style={[globalStyles.row, globalStyles.col_8]}>
                        <Checkbox
                          value={additionalField?.isChecked}
                          onValueChange={(val) => {
                            onAdditionalOptionsCheckboxAction(
                              additionalFieldIndex,
                              val
                            );
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {additionalField?.name || ""}
                          </Text>
                          <View style={[globalStyles.row]}>
                            <Text style={{ fontSize: 14, lineHeight: 17 }}>
                              ￥{additionalField?.additionalPrice || ""}
                            </Text>
                            <Text style={{ fontSize: 14, lineHeight: 17 }}>
                              {"/"}
                            </Text>
                            <Text style={{ fontSize: 14, lineHeight: 17 }}>
                              {paymentTerm || ""}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={[
                          globalStyles.row,
                          { flex: 1, justifyContent: "flex-end" },
                        ]}
                      >
                        <Picker
                          style={[globalStyles.col_12]}
                          mode="dialog"
                          placeholder="Select Category"
                          selectedValue={additionalField?.quantity}
                          onValueChange={(itemValue) => {
                            onAdditionalFieldChangeQuantity(
                              itemValue,
                              additionalFieldIndex
                            );
                          }}
                        >
                          {additionalField?.stockOptions.map((_) => {
                            return (
                              <Picker.Item
                                key={_}
                                label={_.label.toString()}
                                value={_.value}
                              />
                            );
                          })}
                        </Picker>
                        {/* {paymentTerm ? (
                          <Text
                            style={[
                              globalStyles.col_12,
                              { justifyContent: "flex-end" },
                            ]}
                          >
                            {paymentTerm}
                          </Text>
                        ) : (
                          <></>
                        )}
                        {!paymentTerm ? (
                          <Text
                            style={[
                              globalStyles.col_12,
                              { justifyContent: "flex-end" },
                            ]}
                          >
                            No additional charge
                          </Text>
                        ) : (
                          <></>
                        )} */}
                      </View>
                    </View>
                  </View>
                );
              }
            )}
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginTop: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
            利用可能サブスクリプション
          </Text>

          <Subscription
            subscriptionType="hotel"
            priceData={priceData}
            spaceDetail={plan}
            useSubscription={useSubscription}
            subscriptionCategoryPrice={HOTEL_SUBSCRIPTION_CATEGORIES.B}
            onSelect={setSubscription}
            hasSubscription={hasHotelSubscriptions}
          />
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", flexGrow: 1 }}>
              お支払方法
            </Text>
            <View>
              <Touchable
                onPress={() => {
                  // check if logged in
                  if (!accessToken) {
                    Alert.alert("ログインしてください。");
                  } else {
                    coordinator.toPaymentMethodScreen();
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: colors.primary,
                  }}
                >
                  カード追加
                </Text>
              </Touchable>
            </View>
          </View>
          <View style={{ marginTop: 15 }}>
            <SelectPayment onSelect={setPaymentSource} />
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginTop: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
            料金
          </Text>

          {calculatingPrice || loading ? (
            <>
              <View style={[globalStyles.row, { justifyContent: "center" }]}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>...</Text>
              </View>
            </>
          ) : (
            <></>
          )}

          {!calculatingPrice && !loading && priceCalculationError ? (
            <>
              <View style={[globalStyles.row, { justifyContent: "center" }]}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Opps something went wrong ...
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}

          {!calculatingPrice &&
            !loading &&
            !priceCalculationError &&
            priceData && (
              <>
                <View
                  style={[
                    globalStyles.row,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>小計</Text>
                  {priceData.planAmount ? (
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      {currencyFormatter(
                        Math.ceil((priceData.planAmount || 0) / 1.1)
                      )}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>

                {additionalOptionsFields
                  ?.filter((item: any) => !!item?.isChecked)
                  ?.map((additionalfield: any, index) => {
                    const optionsCharge =
                      currencyFormatter(
                        Math.ceil(
                          (additionalfield?.additionalPrice *
                            additionalfield?.quantity) /
                            1.1
                        )
                      ) || "No Charge";

                    return (
                      <View
                        key={index}
                        style={[
                          globalStyles.row,
                          {
                            justifyContent: "space-between",
                            marginVertical: 10,
                          },
                        ]}
                      >
                        <View
                          style={[
                            globalStyles.row,
                            globalStyles.col_5,
                            { justifyContent: "space-between" },
                          ]}
                        >
                          <Text style={{ fontSize: 16, fontWeight: "700" }}>
                            {additionalfield?.name || ""}
                          </Text>
                          <Text style={{ fontSize: 12, fontWeight: "700" }}>
                            {additionalfield?.quantity || ""}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "700" }}>
                          {optionsCharge}
                        </Text>
                      </View>
                    );
                  })}

                <View
                  style={[
                    globalStyles.row,
                    { justifyContent: "space-between", marginVertical: 10 },
                  ]}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>税金</Text>
                  <Text>{currencyFormatter(taxCalculated) || 0}</Text>
                </View>

                <View
                  style={[
                    globalStyles.row,
                    {
                      justifyContent: "space-between",
                      marginVertical: 10,
                      borderTopWidth: 1,
                      borderTopColor: colors.surfaceVariant,
                      paddingTop: 12,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    合計 (税込)
                  </Text>

                  {priceData?.totalAmount ? (
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      {currencyFormatter(
                        Math.ceil(priceData?.totalAmount || 0)
                      )}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
              </>
            )}
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
            marginVertical: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
            キャンセルポリシー
          </Text>
          <View>
            {plan?.cancelPolicy && (
              <>
                {/* <Text style={{ fontSize: 18, color: colors.textVariant }}>
                  {spaceDetails?.cancelPolicy?.name}
                </Text> */}
                <View>
                  {[...plan?.cancelPolicy.rates]
                    .sort((a, b) => a.beforeHours - b.beforeHours)
                    .map((policy, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 6,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: colors.textVariant,
                              fontWeight: "500",
                            }}
                          >
                            {hoursAsCancelPolicyDuration(policy.beforeHours)}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: colors.text,
                              fontWeight: "700",
                            }}
                          >
                            {policy.percentage}%
                          </Text>
                        </View>
                      );
                    })}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View>
        {!selectedPayment && (
          <View
            style={[
              globalStyles.row,
              {
                backgroundColor: colors.surfaceVariant,
                paddingVertical: 14,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              お支払方法を選択してください
            </Text>
          </View>
        )}
        {selectedPayment && (
          <Button
            loading={reservingHotel}
            title="予約"
            titleStyle={{
              color: "#fff",
              fontSize: 18,
            }}
            onPress={handleReservation}
            disabled={
              !!calculatingPrice || !!priceCalculationError || !!loading
            }
            containerStyle={{
              backgroundColor: colors.primary,
              borderRadius: 0,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export const ConfirmReserve = observer(ReserveHotel);
