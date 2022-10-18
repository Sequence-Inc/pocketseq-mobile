import { RouteProp, useRoute } from "@react-navigation/native";
import {
  useResetPassword,
  ResetPasswordInput,
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

export type IResetPasswordScreenProps = {
  coordinator: AuthCoordinator;
};

export const ResetPasswordScreen: React.FC<IResetPasswordScreenProps> = ({
  coordinator,
}) => {
  const { colors, images, strings } = useResources();
  const route: RouteProp<{ params: { email: string; code: string } }> =
    useRoute();

  const [form, setForm] = React.useState<ResetPasswordInput>({
    email: route.params.email,
    newPassword: "",
    code: route.params.code,
  });

  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [handleResetPassword, { loading: resetingPassword }] =
    useResetPassword();
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const onResetPasswordSuccess = React.useCallback(
    () => coordinator.toLoginScreen(),
    []
  );
  const onCancelPasswordPress = React.useCallback(
    () => coordinator.toLoginScreen(),
    []
  );

  const onResetPassword = React.useCallback(async () => {
    if (resetingPassword) return;

    if (form.newPassword !== confirmPassword) {
      setErrorMessage("Password mismatched");
      return;
    }

    const resetData = await handleResetPassword(form);

    if (resetData.data) return onResetPasswordSuccess();

    console.log(resetData.errors);
    setErrorMessage("Could not reset password");
  }, [form, confirmPassword, onResetPasswordSuccess]);

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
            label={`${strings("password")}`}
            placeholder={`${strings("password_hint")}`}
            secureTextEntry={true}
            onChangeText={(val) =>
              setForm((prev) => ({
                ...prev,
                newPassword: val,
              }))
            }
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("confirm_password")}`}
            placeholder={`${strings("confirm_password_hint")}`}
            secureTextEntry={true}
            onChangeText={(val) => setConfirmPassword(val)}
          />
          <Button
            containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
            onPress={onResetPassword}
            loading={resetingPassword}
            titleStyle={{ color: colors.background }}
            title={`${strings("reset")}`}
          />
          <Button
            containerStyle={{
              backgroundColor: colors.primaryVariant,
              margin: 12,
            }}
            onPress={onCancelPasswordPress}
            disabled={resetingPassword}
            titleStyle={{ color: colors.background }}
            title={`${strings("cancel")}`}
          />

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
            {strings("copyright")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
