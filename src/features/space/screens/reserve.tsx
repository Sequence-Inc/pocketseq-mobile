import React from "react";
import SpaceCoordinator, {
  TTOCONFIRM__SPACE_RESERVAION_PROPS,
} from "../space-coordinator";
import { ScrollView, Text, View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react";
import { useResources } from "../../../resources";
import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SelectPayment } from "../../../widgets/payment-method";
import useReserveSpace, {
  OptionsType,
} from "../../../services/graphql/hooks/space/use-reserve-space";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { FullScreenErrorView } from "../../../widgets/full-screen-error-view";
import { SessionStore, styleStore } from "../../../services/storage";
import moment from "moment";
import {
  OPTION_PAYMENT_TERMS,
  SPACE_SUBSCRIPTION_CATEGORIES,
} from "../../../widgets/app-config";
import { Checkbox } from "../../../widgets/checkbox";
import { Picker } from "@react-native-picker/picker";
import useCalculateSpacePrice, {
  Utils,
} from "../../../services/graphql/hooks/space/useCalculateSpacePrice";
import { useFetchSubscriptions } from "../../../services/graphql";
import { Button } from "../../../widgets/button";

import { Subscription } from "../../../widgets/my-subscriptions";
import {
  currencyFormatter,
  hoursAsCancelPolicyDuration,
} from "../../../utils/strings";
import { Touchable } from "../../../widgets/touchable";

export type ISpaceReservationConfirmationProps = {
  coordinator: SpaceCoordinator;
};

export type TUseCalculateSpacePriceProps = {
  fromDateTime?: any;
  duration?: any;
  durationType?: any;
  spaceId?: any;
  additionalOptionsFields?: any[];
  useSubscription?: boolean;
};

export const GET_PRICE_PLANS_WITH_AUTH = Utils.gql`
  query ApplicablePricePlansWithAuth($input: GetApplicablePricePlansWithAuthInput) {
    getApplicablePricePlansWithAuth(input: $input) {
      total
      duration
      durationType
      spaceAmount
      optionAmount
      applicablePricePlans {
        id
        title
        duration
        type
        isDefault
        isOverride
        fromDate
        toDate
        amount
        appliedTimes
      }
      subscriptionUnit
      subscriptionAmount
    }
  }
`;

const ReservationConfirmation: React.FC<ISpaceReservationConfirmationProps> = ({
  coordinator,
}) => {
  const { colors } = useResources();
  const headerHeight = useHeaderHeight();
  const [{ accessToken }] = React.useState(() => SessionStore);
  const [{ globalStyles }] = React.useState(() => styleStore);
  const {
    params: { spaceId, fromDateTime, duration, durationType },
  }: RouteProp<{ params: TTOCONFIRM__SPACE_RESERVAION_PROPS }> = useRoute();
  const [selectedPayment, setPaymentSource] = React.useState<null | any>(null);
  const [reservationData, setReservationData] =
    React.useState<TUseCalculateSpacePriceProps>({
      spaceId,
      fromDateTime,
      duration,
      durationType,
      useSubscription: false,
    });

  const {
    spaceDetails,
    fetchingSpace,
    fetchingSpaceError,
    additionalOptionsFields,
    onAdditionalFieldChangeQuantity,
    onAdditionalOptionsCheckboxAction,
    includedOptions,
    handleSpaceReservation,
    reservingSpace,
    reservationFailure,
  } = useReserveSpace(reservationData?.spaceId);

  console.log(reservationFailure);

  const { subscriptions } = useFetchSubscriptions();

  const hasSpaceSubscriptions = React.useMemo(() => {
    if (subscriptions?.mySubscriptions?.length) {
      return subscriptions?.mySubscriptions?.find(
        (subscription: any) => subscription?.type === "rental-space"
      );
    }
  }, [subscriptions]);

  const {
    fetchCalculatedPrice,
    fetchCalculatedPriceWithAuth,
    calculatingPrice,
    loading,
    priceData,
  } = useCalculateSpacePrice();

  const handleFetchPrice = React.useCallback(async () => {
    if (!reservationData) return;
    let calculatePriceInput = {
      ...reservationData,
      additionalOptionsFields: additionalOptionsFields,
    };

    if (
      accessToken &&
      (hasSpaceSubscriptions?.amount > SPACE_SUBSCRIPTION_CATEGORIES.B ||
        hasSpaceSubscriptions?.amount > spaceDetails?.subcriptionPrice)
    ) {
      return fetchCalculatedPriceWithAuth(calculatePriceInput);
    } else {
      return fetchCalculatedPrice(calculatePriceInput);
    }
  }, [
    spaceDetails,
    hasSpaceSubscriptions?.amount,
    reservationData,
    additionalOptionsFields,
    fetchCalculatedPriceWithAuth,
    fetchCalculatedPrice,
    accessToken,
  ]);

  React.useEffect(() => {
    handleFetchPrice();
  }, [handleFetchPrice]);

  const addressText = `〒${spaceDetails?.address?.postalCode} ${spaceDetails?.address?.prefecture.name} ${spaceDetails?.address?.addressLine1} ${spaceDetails?.address?.addressLine2}`;

  const setSubscription = React.useCallback((val) => {
    setReservationData((prev) => ({
      ...prev,
      useSubscription: val,
    }));
  }, []);

  const handleReservation = React.useCallback(async () => {
    try {
      const input = {
        ...reservationData,
        paymentSourceId: selectedPayment?.id,
        additionalOptions: additionalOptionsFields?.map((option: any) => ({
          optionId: option?.id,
          quantity: option?.quantity || 1,
        })),
        useSubscription: !!reservationData?.useSubscription,
      };
      console.log(input);
      const { data } = await handleSpaceReservation(input);
      if (data) {
        Alert.alert("予約完了", "予約リクエストを完了しました。", [
          {
            text: "OK",
            onPress: () => {
              coordinator.toReservationScreen("replace", {
                type: "SPACE",
                data: data?.reserveSpace,
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(error?.message || "Error!");
    }
  }, [selectedPayment, reservationData]);

  const taxCalculated = priceData?.total
    ? Math.ceil(priceData?.total - Math.ceil(priceData?.total / 1.1))
    : 0;

  if (fetchingSpace) {
    return <FullScreenActivityIndicator />;
  }

  if (fetchingSpaceError) {
    return (
      <FullScreenErrorView>
        <View>
          <Text>Opps! Something went wrong.</Text>
        </View>
      </FullScreenErrorView>
    );
  }

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
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>予約</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 8,
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
            <Text style={{ fontWeight: "700" }}>スペース名</Text>
            <Text style={{ fontSize: 16 }}>{spaceDetails?.name || ""}</Text>
            {/* <SelectPayment /> */}
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
            <Text style={{ fontWeight: "700" }}>タイプ</Text>
            <Text style={{ fontSize: 16 }}>スペース</Text>
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
            <Text style={{ fontWeight: "700" }}>住所</Text>
            <Text style={{ fontSize: 16 }}>{addressText}</Text>
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
            <Text style={{ fontWeight: "700" }}>チェックイン</Text>
            <Text style={{ fontSize: 16 }}>
              {reservationData?.fromDateTime &&
                moment(reservationData?.fromDateTime).format("YYYY年MM月DD日")}
              ,{" "}
              {reservationData?.fromDateTime &&
                moment(reservationData?.fromDateTime).format("HH:mm")}
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

            {includedOptions?.length < 1 && (
              <View style={{ marginVertical: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  オプションはありません。
                </Text>
              </View>
            )}
            {includedOptions?.length > 0 &&
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
              })}
          </View>
        )}
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 12,
            paddingVertical: 18,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            オプションの追加
          </Text>

          {additionalOptionsFields?.length < 1 && (
            <View style={{ marginVertical: 12 }}>
              <Text style={{ fontSize: 16 }}>オプションはありません。</Text>
            </View>
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
                              {currencyFormatter(
                                additionalField?.additionalPrice
                              ) || ""}
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
                        {/* {paymentTerm && (
                          <Text
                            style={[
                              globalStyles.col_12,
                              { justifyContent: "flex-end" },
                            ]}
                          >
                            {paymentTerm || ""}
                          </Text>
                        )}
                        {!paymentTerm && (
                          <Text
                            style={[
                              globalStyles.col_12,
                              { justifyContent: "flex-end" },
                            ]}
                          >
                            追加料金なし
                          </Text>
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
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
            利用可能サブスクリプション
          </Text>

          <Subscription
            subscriptionType="rental-space"
            priceData={priceData}
            spaceDetail={spaceDetails}
            subscriptionCategoryPrice={SPACE_SUBSCRIPTION_CATEGORIES.B}
            useSubscription={!!reservationData.useSubscription}
            hasSubscription={hasSpaceSubscriptions}
            onSelect={setSubscription}
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
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                flexGrow: 1,
              }}
            >
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

        {priceData ? (
          <View
            style={{
              backgroundColor: colors.background,
              paddingHorizontal: 12,
              paddingVertical: 18,
              marginTop: 12,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              料金
            </Text>

            <View
              style={[globalStyles.row, { justifyContent: "space-between" }]}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>小計</Text>
              {priceData ? (
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {currencyFormatter(Math.ceil(priceData?.spaceAmount / 1.1)) ||
                    "..."}
                </Text>
              ) : (
                <></>
              )}
            </View>

            {(!calculatingPrice || !loading) &&
              additionalOptionsFields
                ?.filter((item: any) => !!item?.isChecked)
                ?.map((additionalfield: any, index) => {
                  const optionsCharge =
                    currencyFormatter(
                      Math.ceil(
                        (additionalfield?.additionalPrice *
                          additionalfield?.quantity) /
                          1.1
                      )
                    ) || "...";

                  return (
                    <View
                      key={index}
                      style={[
                        globalStyles.row,
                        { justifyContent: "space-between", marginVertical: 10 },
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
                          {additionalfield?.name}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: "700" }}>
                          {additionalfield?.quantity}
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
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {currencyFormatter(taxCalculated) || "..."}
              </Text>
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

              {priceData?.total ? (
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  {currencyFormatter(Math.ceil(priceData?.total)) || "..."}
                </Text>
              ) : (
                <></>
              )}
            </View>
          </View>
        ) : (
          <></>
        )}

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
            {spaceDetails?.cancelPolicy && (
              <>
                {/* <Text style={{ fontSize: 18, color: colors.textVariant }}>
                  {spaceDetails?.cancelPolicy?.name}
                </Text> */}
                <View>
                  {[...spaceDetails?.cancelPolicy.rates]
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
            title="予約"
            titleStyle={{
              color: "#fff",
              fontSize: 18,
            }}
            loading={reservingSpace}
            onPress={handleReservation}
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

export const SpaceReservationConfirmation = observer(ReservationConfirmation);
