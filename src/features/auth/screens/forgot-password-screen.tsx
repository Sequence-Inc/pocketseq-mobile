import {
  useForgotPassword,
  ForgotPaswordInput,
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

export type IForgotPasswordScreenProps = {
  coordinator: AuthCoordinator;
};

export const ForgotPasswordScreen: React.FC<IForgotPasswordScreenProps> = ({
  coordinator,
}) => {
  const { colors, images, strings } = useResources();
  const [handleForgetPassword, { loading }] = useForgotPassword();

  const [email, setEmail] = React.useState<string>("");
  const onLoginPress = React.useCallback(() => coordinator.toLoginScreen(), []);
  // const onResetPress = React.useCallback(() => coordinator.toForgotPasswordVerificationScreen("replace"), []);

  const onResetPress = React.useCallback(async () => {
    try {
      if (loading) return;
      const result = await handleForgetPassword({ email });
      if (result.data)
        coordinator.toForgotPasswordVerificationScreen("replace", email);
    } catch (err) {
      console.log("Could not reset password", err);
    }
  }, [email, loading]);

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
              color: colors.secondary,
              fontSize: 16,
              fontWeight: "bold",
              margin: 12,
              textAlign: "center",
            }}
          >
            {strings("reset_password")}
          </Text>
          <TextInput
            containerStyle={{ margin: 12 }}
            keyboardType="email-address"
            label={`${strings("mail_address")}`}
            onChangeText={React.useCallback(
              (email) => setEmail(email),
              [email]
            )}
            placeholder={`${strings("mail_address_hint")}`}
          />
          <Button
            containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
            onPress={onResetPress}
            loading={loading}
            titleStyle={{ color: colors.background }}
            title={`${strings("reset")}`}
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
                {strings("those_who_have_acc")}
              </Text>
            </View>
          </View>
          <Button
            containerStyle={{
              backgroundColor: colors.primaryVariant,
              margin: 12,
            }}
            onPress={onLoginPress}
            disabled={loading}
            titleStyle={{ color: colors.background }}
            title={`${strings("do_login")}`}
          />
          <Text style={{ color: colors.text, margin: 28, textAlign: "center" }}>
            {strings("copyright")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
