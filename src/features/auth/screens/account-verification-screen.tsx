import { RouteProp, useRoute } from "@react-navigation/native";
import {
  useResendVerificationCode,
  useVerifyEmail,
} from "../../../services/graphql";
import { Button } from "../../../widgets/button";
import { SVGImage } from "../../../widgets/svg-image";
import { TextInput } from "../../../widgets/text-input";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AuthCoordinator from "../auth-coordinator";

export type IAccountVerificationScreenProps = {
  coordinator: AuthCoordinator;
};

export const AccountVerificationScreen: React.FC<
  IAccountVerificationScreenProps
> = ({ coordinator }) => {
  const { colors, images } = useResources();
  const route: RouteProp<{ params: { email: string } }> = useRoute();
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const [handleResendPasscode, { loading: resendingPasscode }] =
    useResendVerificationCode();
  const onCancelPress = React.useCallback(
    () => coordinator.toLoginScreen("replace"),
    []
  );
  const onConfirmPress = React.useCallback(
    () => coordinator.toLoginScreen(),
    []
  );

  const [handleVerifyEmail, { loading: verifyingEmail }] = useVerifyEmail();

  const onVerifyEmail = React.useCallback(async () => {
    if (verifyingEmail) return;
    const emailVerified = await handleVerifyEmail({
      email: route.params.email,
      code: Number(code),
    });
    if (emailVerified.data) return onConfirmPress();
    setErrorMessage("Verification code invalid/expired.");
  }, [code, onConfirmPress]);

  const onResendPasscode = React.useCallback(async () => {
    if (verifyingEmail || resendingPasscode) return;

    const resent = await handleResendPasscode({ email: route.params.email });
    if (resent.data) {
      setSuccessMessage("Resent verification code.");
      setErrorMessage("");
    }
    if (resent.error) {
      setErrorMessage("Could not resend passcode.");
      setSuccessMessage("");

      console.log("error", resent.error);
    }
  }, [verifyingEmail, resendingPasscode]);

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView keyboardDismissMode="on-drag">
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            padding: 14,
          }}
        >
          <SVGImage
            style={{ aspectRatio: 3.8, width: "64%", marginVertical: 12 }}
            source={images.svg.logo_primary}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "bold",
              margin: 12,
              textAlign: "center",
            }}
          >
            アカウント確認コードを確認してください
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              margin: 12,
              textAlign: "center",
            }}
          >
            確認コードが「{route?.params?.email}」に送信されました
          </Text>
          <TextInput
            containerStyle={{ margin: 12 }}
            keyboardType="number-pad"
            label={`確認コード入力`}
            maxLength={6}
            onChangeText={(val) => setCode(val)}
            placeholder={`確認コード入力`}
          />
          <Button
            containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
            onPress={onVerifyEmail}
            loading={verifyingEmail}
            disabled={resendingPasscode}
            titleStyle={{ color: colors.background }}
            title={`決定`}
          />
          <Button
            containerStyle={{
              backgroundColor: colors.primaryVariant,
              margin: 12,
            }}
            onPress={onCancelPress}
            disabled={verifyingEmail || resendingPasscode}
            titleStyle={{ color: colors.background }}
            title={`キャンセル`}
          />
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              margin: 12,
            }}
          >
            <View
              style={{
                backgroundColor: colors.primaryVariant,
                height: 1,
                position: "absolute",
                width: "100%",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  fontSize: 14,
                }}
              >
                コードを受け取っていない場合
              </Text>
            </View>
          </View>
          <Button
            containerStyle={{ backgroundColor: colors.secondary, margin: 12 }}
            titleStyle={{ color: colors.background }}
            loading={resendingPasscode}
            disabled={verifyingEmail}
            onPress={onResendPasscode}
            title={`コードを再送する`}
          />

          {successMessage ? (
            <Text
              style={{
                color: colors.primaryVariant,
                margin: 28,
                textAlign: "center",
              }}
            >
              {successMessage}
            </Text>
          ) : (
            <></>
          )}
          {errorMessage ? (
            <Text
              style={{ color: colors.error, margin: 28, textAlign: "center" }}
            >
              {errorMessage}
            </Text>
          ) : (
            <></>
          )}
          <Text style={{ color: colors.text, margin: 28, textAlign: "center" }}>
            © copyright PocketseQ 2023.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
