import { LoginInput, useLogin } from "../../../services/graphql";
import { SessionStore } from "../../../services/storage";

import { Button } from "../../../widgets/button";
import { SVGImage } from "../../../widgets/svg-image";
import { TextInput } from "../../../widgets/text-input";
import { isEmpty } from "lodash";
import { observer } from "mobx-react";

import { flowResult } from "mobx";
import React from "react";
import { Alert, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AuthCoordinator from "../auth-coordinator";

export type ILoginScreenProps = {
  coordinator: AuthCoordinator;
};

export const LoginScreen: React.FC<ILoginScreenProps> = observer(
  ({ coordinator }) => {
    const { colors, images, strings } = useResources();
    const [login, { loading }] = useLogin();
    const [input, setInput] = React.useState<Partial<LoginInput>>({});
    const [{ saveLogin }] = React.useState(SessionStore);
    const onForgotPasswordPress = React.useCallback(
      () => !loading && coordinator.toForgotPasswordScreen(),
      []
    );
    const onLoginPress = React.useCallback(async () => {
      try {
        if (loading) return;
        const { email, password } = input;
        if (isEmpty(email) || isEmpty(password)) console.log("Empty fields");
        const result = await login({ email: email!!, password: password!! });
        if (result.data) {
          flowResult(saveLogin({ ...result.data?.login }));
          coordinator.toDashboardScreen();
        }
      } catch (err: any) {
        console.log(err);
        Alert.alert(err.message);
      }
    }, [input]);
    const onSignupPress = React.useCallback(
      () => !loading && coordinator.toSignupScreen("replace"),
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
                color: colors.secondary,
                fontSize: 16,
                fontWeight: "bold",
                margin: 12,
                textAlign: "center",
              }}
            >
              {strings("login")}
            </Text>
            <TextInput
              containerStyle={{ margin: 12 }}
              editable={!loading}
              keyboardType="email-address"
              label={`${strings("mail_address")}`}
              onChangeText={React.useCallback(
                (email) => setInput({ ...input, email }),
                [input]
              )}
              placeholder={`${strings("mail_address_hint")}`}
            />
            <TextInput
              containerStyle={{ margin: 12 }}
              editable={!loading}
              label={`${strings("password")}`}
              placeholder={`${strings("password_hint")}`}
              onChangeText={React.useCallback(
                (password) => setInput({ ...input, password }),
                [input]
              )}
              secureTextEntry={true}
            />
            <Text
              onPress={onForgotPasswordPress}
              style={{
                color: colors.link,
                fontSize: 12,
                margin: 18,
                marginTop: 0,
                alignSelf: "flex-end",
              }}
            >
              {strings("forgot_password")}
            </Text>
            <Button
              containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
              loading={loading}
              onPress={onLoginPress}
              titleStyle={{ color: colors.background }}
              title={`${strings("do_login")}`}
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
                  {strings("do_you_have_acc")}
                </Text>
              </View>
            </View>
            <Button
              containerStyle={{
                backgroundColor: colors.primaryVariant,
                margin: 12,
              }}
              disabled={loading}
              onPress={onSignupPress}
              titleStyle={{ color: colors.background }}
              title={`${strings("create_acc")}`}
            />
            <Text
              style={{ color: colors.text, margin: 28, textAlign: "center" }}
            >
              {strings("copyright")}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
);
