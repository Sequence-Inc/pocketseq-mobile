import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import { Touchable } from "../../../widgets/touchable";
import { usePaymentMethods } from "../../../services/graphql";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { SVGImage } from "../../../widgets/svg-image";
import { usePaymentSheet } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { PaymentMethodItem } from "../../../widgets/payment-method-item";

export interface IAccountPaymentMethodScreenProps {
  coordinator: AccountCoordinator;
}

const returnURL =
  Constants.appOwnership === "expo"
    ? Linking.createURL("/--/pocketseq/stripe-redirect")
    : Linking.createURL("pocketseq/stripe-redirect");

export const AccountPaymentMethodScreen: React.FC<
  IAccountPaymentMethodScreenProps
> = () => {
  const [ready, setReady] = useState<boolean>(false);

  const headerHeight = useHeaderHeight();
  const { colors, images } = useResources();
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const {
    fetchPaymentMethods,
    paymentMethodsLoading,
    paymentMethodsError,
    paymentMethods,
    refetchPaymentMethods,
  } = usePaymentMethods();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    initializePaymentSheet();
  }, [paymentMethods]);

  const initializePaymentSheet = useCallback(async () => {
    if (paymentMethods?.setupIntent) {
      const { error } = await initPaymentSheet({
        setupIntentClientSecret: paymentMethods?.setupIntent,
        merchantDisplayName: "PocketseQ",
        allowsDelayedPaymentMethods: true,
        returnURL,
      });
      if (error) {
        console.log(error.message);
        Alert.alert(
          "There was an error while loading setup intent for new card addition."
        );
      } else {
        setReady(true);
      }
    }
  }, [paymentMethods?.setupIntent]);

  const showPaymentSheet = async () => {
    if (ready) {
      const { error } = await presentPaymentSheet();
      if (error) {
        if (error.code !== "Canceled")
          Alert.alert("Error occurred!", error.message);
      } else {
        setReady(false);
        refetchPaymentMethods();
      }
    }
  };

  if (paymentMethodsLoading) {
    return <FullScreenActivityIndicator />;
  }

  if (paymentMethodsError) {
    return (
      <View>
        <Text>There was an error!</Text>
        <Text>{paymentMethodsError.message}</Text>
      </View>
    );
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
      <FlatList
        data={paymentMethods?.paymentSource || []}
        renderItem={({ item, index }) => (
          <PaymentMethodItem key={index} item={item} />
        )}
        ListHeaderComponent={() => {
          return (
            <View style={{ flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.textVariant,
                    marginTop: 32,
                    marginBottom: 24,
                    flexGrow: 1,
                  }}
                >
                  登録してるカード
                </Text>
                <Touchable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.background,
                    paddingHorizontal: 18,
                    paddingVertical: 9,
                    borderRadius: 3,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 1.41,

                    elevation: 2,
                  }}
                  onPress={showPaymentSheet}
                >
                  <SVGImage
                    source={images.svg.card_generic}
                    override={{ width: 24, height: 15 }}
                    color={colors.background}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.textVariant,
                      marginLeft: 8,
                    }}
                  >
                    カード追加
                  </Text>
                </Touchable>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};
