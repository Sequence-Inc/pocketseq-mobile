import { SignUpInput, useSignup } from "../../../services/graphql";
import { Button } from "../../../widgets/button";
import { Checkbox } from "../../../widgets/checkbox";
import { SVGImage } from "../../../widgets/svg-image";
import { TextInput } from "../../../widgets/text-input";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AuthCoordinator from "../auth-coordinator";

export type ISignupScreenProps = {
  coordinator: AuthCoordinator;
};

export const SignupScreen: React.FC<ISignupScreenProps> = ({ coordinator }) => {
  const { colors, images, strings } = useResources();
  const [form, setForm] = useState<SignUpInput>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    firstNameKana: "",
    lastNameKana: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>();

  const onLoginPress = React.useCallback(
    () => coordinator.toLoginScreen("replace"),
    []
  );
  const [handleSignup, { loading: signingUp }] = useSignup();

  const handleFormChange = React.useCallback(
    (val: string, fieldName: string) => {
      setForm((prev) => ({
        ...prev,
        [fieldName]: val,
      }));
    },
    [form]
  );

  const onCreateAccount = React.useCallback(async () => {
    if (form.password !== confirmPassword) {
      setErrorMessage("Confirmation password mismatch");
      return;
    }
    const signedUp = await handleSignup({
      ...form,
    });

    if (signedUp.data)
      return coordinator.toAccountVerificationScreen("replace", form.email);
    if (signedUp.errors) {
      console.log({ error: signedUp.errors });
      setErrorMessage("Could not sign up");
    }
  }, [form]);

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
            {strings("create_acc")}
          </Text>
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("lastname")}`}
            placeholder={`${strings("lastname")}`}
            onChangeText={(val) => handleFormChange(val, "lastName")}
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("name")}`}
            onChangeText={(val) => handleFormChange(val, "firstName")}
            placeholder={`${strings("name_hint")}`}
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("lastname_kana")}`}
            placeholder={`${strings("lastname_kana_example")}`}
            onChangeText={(val) => handleFormChange(val, "lastNameKana")}
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("name_kana")}`}
            placeholder={`${strings("name_kana_hint")}`}
            onChangeText={(val) => handleFormChange(val, "firstNameKana")}
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            keyboardType="email-address"
            label={`${strings("mail_address")}`}
            placeholder={`${strings("mail_address_hint")}`}
            onChangeText={(val) => handleFormChange(val, "email")}
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("password")}`}
            placeholder={`${strings("password_hint")}`}
            secureTextEntry={true}
            onChangeText={(val) => handleFormChange(val, "password")}
          />
          <TextInput
            containerStyle={{ margin: 12 }}
            label={`${strings("confirm_password")}`}
            placeholder={`${strings("confirm_password_hint")}`}
            secureTextEntry={true}
            onChangeText={(val) => setConfirmPassword(val)}
          />
          <Checkbox
            onValueChange={(val) => setTermsAccepted(val)}
            value={termsAccepted}
            containerStyle={{ marginHorizontal: 12 }}
            text={`${strings("i_agree_the_terms")}`}
            textStyle={{ color: colors.link }}
          />
          <Button
            containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
            disabled={!termsAccepted}
            onPress={onCreateAccount}
            loading={signingUp}
            titleStyle={{ color: colors.background }}
            title={`${strings("create_acc")}`}
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
            titleStyle={{ color: colors.background }}
            title={`${strings("do_login")}`}
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
