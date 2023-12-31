import { RouteProp, useRoute } from "@react-navigation/native";
import {
  useResendVerificationCode,
  useVerifyPasswordResetCode,
} from "../../../services/graphql";
import { Button } from "../../../widgets/button";
import { SVGImage } from "../../../widgets/svg-image";
import { TextInput } from "../../../widgets/text-input";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AuthCoordinator from "../auth-coordinator";

export type IForgotPasswordVerificationScreenProps = {
  coordinator: AuthCoordinator;
};

// expo;

export const ForgotPasswordVerificationScreen: React.FC<
  IForgotPasswordVerificationScreenProps
> = ({ coordinator }) => {
  const { colors, images } = useResources();
  const route: RouteProp<{ params: { email: string } }> = useRoute();
  const [code, setCode] = React.useState<string>("");
  const [handleVerifyPasscode, { loading: verifyingPasscode }] =
    useVerifyPasswordResetCode();
  const [handleResendPasscode, { loading: resendingPasscode }] =
    useResendVerificationCode();
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const onConfirmPress = React.useCallback(async () => {
    if (verifyingPasscode || resendingPasscode) return;
    try {
      const verified = await handleVerifyPasscode({
        email: route.params.email,
        code,
      });
      if (verified.data)
        return coordinator.toResetPasswordScreen("replace", {
          email: route.params.email,
          code,
        });
    } catch (err) {
      console.log("Error while verifying reset passcode");
      setErrorMessage("Wrong passcode or passcode expired.");
      setSuccessMessage("");
    }
  }, [code, verifyingPasscode, resendingPasscode]);

  const onResendPasscode = React.useCallback(async () => {
    if (verifyingPasscode || resendingPasscode) return;

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
  }, [verifyingPasscode, resendingPasscode]);
  const onCancelPress = React.useCallback(
    () => coordinator.toLoginScreen(),
    []
  );
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
            パスワードリセットコードを確認
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              margin: 12,
              textAlign: "center",
            }}
          >
            確認コードが「{route.params?.email}」に送信されました
          </Text>
          <TextInput
            containerStyle={{ margin: 12 }}
            keyboardType="number-pad"
            label={`確認コード入力`}
            maxLength={6}
            onChangeText={React.useCallback((text) => setCode(text), [code])}
            placeholder={`確認コード入力`}
          />
          <Button
            loading={verifyingPasscode}
            containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
            onPress={onConfirmPress}
            titleStyle={{ color: colors.background }}
            title={`決定`}
          />
          <Button
            disabled={verifyingPasscode}
            containerStyle={{
              backgroundColor: colors.primaryVariant,
              margin: 12,
            }}
            onPress={onCancelPress}
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
            loading={resendingPasscode}
            disabled={verifyingPasscode}
            containerStyle={{ backgroundColor: colors.secondary, margin: 12 }}
            titleStyle={{ color: colors.background }}
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
