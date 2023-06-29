import {
  LoginInput,
  SocialLoginInput,
  useLogin,
  useMyProfile,
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
import { Alert, Text, View, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import AuthCoordinator from "../auth-coordinator";
// import { registerNotifications } from "../../../utils/notification";
import * as AppleAuthentication from "expo-apple-authentication";

import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import { ResponseType } from "expo-auth-session";

export type ILoginScreenProps = {
  coordinator: AuthCoordinator;
};

WebBrowser.maybeCompleteAuthSession();

// https://docs.expo.dev/versions/latest/sdk/apple-authentication/#error-codes
type AppleAuthenticationError = {
  code:
    | "ERR_INVALID_OPERATION"
    | "ERR_INVALID_RESPONSE"
    | "ERR_INVALID_SCOPE"
    | "ERR_REQUEST_CANCELED"
    | "ERR_REQUEST_FAILED"
    | "ERR_REQUEST_NOT_HANDLED"
    | "ERR_REQUEST_NOT_INTERACTIVE"
    | "ERR_REQUEST_UNKNOWN";
};

export const LoginScreen: React.FC<ILoginScreenProps> = observer(
  ({ coordinator }) => {
    const { colors, images } = useResources();
    const [input, setInput] = React.useState<Partial<LoginInput>>({});
    const [{ saveLogin }] = React.useState(SessionStore);
    const [login, { loading }] = useLogin();
    const [socialLogin, { loading: socialLoginLoading }] = useSocialLogin();
    const { myProfile } = useMyProfile();

    const [requestFB, responseFB, promptAsyncFB] = Facebook.useAuthRequest({
      clientId: "3219481098313902",
      responseType: ResponseType.Token,
    });
    const [requestGoogle, responseGoogle, promptAsyncGoogle] =
      Google.useIdTokenAuthRequest({
        clientId:
          "433774052323-s08bivoltig4h9enlidqrj8ja7ghe0g0.apps.googleusercontent.com",
        iosClientId:
          "433774052323-728i8icfbc4dfpqo75lo5h5fhqemjlbg.apps.googleusercontent.com",
        androidClientId:
          "433774052323-b1v3dps6o8vkltmevobci2b9cena85og.apps.googleusercontent.com",
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
        // const deviceID = await registerNotifications();
        const deviceID = "";
        const result = await login({
          email: email!!,
          password: password!!,
          deviceID,
        });
        if (result.data) {
          await flowResult(saveLogin({ ...result.data?.login }));
          const profile = await myProfile();
          if (profile.data) {
            const { accessToken, refreshToken } = result.data?.login;
            await flowResult(
              saveLogin({
                accessToken,
                refreshToken,
                profile: profile.data?.myProfile,
              })
            );
          }

          coordinator.toDashboardScreen("replace");
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
            await flowResult(saveLogin({ ...result.data?.socialLogin }));

            const profile = await myProfile();
            if (profile.data) {
              const { accessToken, refreshToken } = result.data?.socialLogin;
              await flowResult(
                saveLogin({
                  accessToken,
                  refreshToken,
                  profile: profile.data?.myProfile,
                })
              );
            }

            coordinator.toDashboardScreen("replace");
          }
        } catch (error: any) {
          console.log(error);
          Alert.alert(error.message);
        }
      },
      []
    );

    const handleAppleSignIn = React.useCallback(async () => {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        // signed in

        // check server to see if the credentials are valid
        onSocialLogin({
          provider: "apple",
          providerAccountId: credential.user,
          id_token: `${credential.identityToken}`,
        });
      } catch (e) {
        const error = e as AppleAuthenticationError;
        if (error.code === "ERR_REQUEST_CANCELED") {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
          Alert.alert("Error!", JSON.stringify(error));
        }
      }
    }, []);

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
              ログイン
            </Text>
            <TextInput
              containerStyle={{ margin: 12 }}
              editable={!loading || !socialLoginLoading}
              keyboardType="email-address"
              label={`メールアドレス`}
              onChangeText={React.useCallback(
                (email: string) => setInput({ ...input, email }),
                [input]
              )}
              placeholder={`例）taro@mail.com`}
            />
            <TextInput
              containerStyle={{ margin: 12 }}
              editable={!loading || !socialLoginLoading}
              label={`パスワード`}
              placeholder={`パスワード`}
              onChangeText={React.useCallback(
                (password: string) => setInput({ ...input, password }),
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
              パスワードをお忘れですか
            </Text>
            <Button
              containerStyle={{ backgroundColor: colors.primary, margin: 12 }}
              loading={
                loading || socialLoginLoading || !requestFB || !requestGoogle
              }
              onPress={onLoginPress}
              titleStyle={{ color: colors.background }}
              title={`ログインする`}
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
            {Platform.OS === "ios" && (
              <View
                style={{
                  paddingHorizontal: 12,
                  marginTop: 12,
                  height: 40,
                  width: "100%",
                }}
              >
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={
                    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                  }
                  cornerRadius={8}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onPress={handleAppleSignIn}
                />
              </View>
            )}
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
                  アカウントをお持ちではありませんか？
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
              title={`アカウントを作成する`}
            />
            <Text
              style={{ color: colors.text, margin: 28, textAlign: "center" }}
            >
              © copyright PocketseQ 2023.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
);
