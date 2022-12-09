import {
  LoginInput,
  SocialLoginInput,
  useLogin,
  useSocialLogin,
} from "../../../services/graphql";
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
import { registerNotifications } from "../../../utils/notification";

import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import { ResponseType } from "expo-auth-session";

export type ILoginScreenProps = {
  coordinator: AuthCoordinator;
};

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen: React.FC<ILoginScreenProps> = observer(
  ({ coordinator }) => {
    const { colors, images, strings } = useResources();
    const [input, setInput] = React.useState<Partial<LoginInput>>({});
    const [{ saveLogin }] = React.useState(SessionStore);
    const [socialLoginInput, setSocialLoginInput] =
      React.useState<SocialLoginInput | null>(null);
    const [login, { loading }] = useLogin();
    const [socialLogin, { loading: socialLoginLoading }] = useSocialLogin();

    const [requestFB, responseFB, promptAsyncFB] = Facebook.useAuthRequest({
      clientId: "857708635675643",
      responseType: ResponseType.Token,
    });
    const [requestGoogle, responseGoogle, promptAsyncGoogle] =
      Google.useIdTokenAuthRequest({
        clientId:
          "145904259029-ef78u8t8ue97i0jumes58kpgkor6ut1u.apps.googleusercontent.com",
        iosClientId:
          "145904259029-rharoiel15uferss2aai07lejgs0s834.apps.googleusercontent.com",
        androidClientId:
          "145904259029-fgie3cq5o3p03bk7vihl3t0m8m1j12pm.apps.googleusercontent.com",
        responseType: ResponseType.IdToken,
        selectAccount: true,
      });

    React.useEffect(() => {
      if (responseFB?.type === "success") {
        if (responseFB?.authentication?.accessToken) {
          fetch(
            `https://graph.facebook.com/me?access_token=${responseFB?.authentication?.accessToken}`
          )
            .then((response) => response.json())
            .then((data) => {
              onSocialLogin({
                provider: "facebook",
                providerAccountId: data.id,
                id_token: `${responseFB?.authentication?.accessToken}`,
              });
            })
            .catch((error) => {
              console.log(error);
              Alert.alert(error.message);
            });
        }
      }
    }, [responseFB]);

    React.useEffect(() => {
      if (responseGoogle?.type === "success") {
        if (responseGoogle?.params?.id_token) {
          fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${responseGoogle?.params?.id_token}`
          )
            .then((response) => response.json())
            .then((data) => {
              onSocialLogin({
                provider: "google",
                providerAccountId: data.sub,
                id_token: `${responseGoogle?.params?.id_token}`,
              });
            })
            .catch((error) => {
              console.log(error);
              Alert.alert(error.message);
            });
        }
      }
    }, [responseGoogle]);

    const onForgotPasswordPress = React.useCallback(
      () => !loading && coordinator.toForgotPasswordScreen(),
      []
    );

    const onLoginPress = React.useCallback(async () => {
      try {
        if (loading) return;
        const { email, password } = input;
        if (isEmpty(email) || isEmpty(password)) console.log("Empty fields");
        const deviceID = await registerNotifications();
        const result = await login({
          email: email!!,
          password: password!!,
          deviceID,
        });
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

    const onSocialLogin = React.useCallback(
      async (params: SocialLoginInput) => {
        try {
          if (loading) return;
          // TODO: updated social login mutation to accept deviceID
          // const deviceID = await registerNotifications();
          const result = await socialLogin(params);
          if (result.data) {
            flowResult(saveLogin({ ...result.data?.socialLogin }));
            coordinator.toDashboardScreen();
          }
        } catch (error: any) {
          console.log(error);
          Alert.alert(error.message);
        }
      },
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
              editable={!loading || !socialLoginLoading}
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
              editable={!loading || !socialLoginLoading}
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
              loading={
                loading || socialLoginLoading || !requestFB || !requestGoogle
              }
              onPress={onLoginPress}
              titleStyle={{ color: colors.background }}
              title={`${strings("do_login")}`}
            />
            <Button
              containerStyle={{ backgroundColor: "#4285F4", margin: 12 }}
              loading={
                loading || socialLoginLoading || !requestFB || !requestGoogle
              }
              onPress={() => {
                promptAsyncGoogle();
              }}
              titleStyle={{ color: colors.background }}
              title={`Googleでログイン`}
            />
            <Button
              containerStyle={{
                backgroundColor: "#1877F2",
                marginHorizontal: 12,
                marginTop: 0,
              }}
              loading={
                loading || socialLoginLoading || !requestFB || !requestGoogle
              }
              onPress={() => {
                promptAsyncFB();
              }}
              titleStyle={{ color: colors.background }}
              title={`Facebookでログイン`}
            />
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                margin: 12,
                marginTop: 24,
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
                    paddingHorizontal: 8,
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
