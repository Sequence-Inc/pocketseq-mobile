import { SessionStore } from "../../../services/storage";
import { SVGImage } from "../../../widgets/svg-image";
import { Touchable } from "../../../widgets/touchable";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useResources } from "../../../resources";
import DashboardCoordinator from "../dashboard-coordinator";
import { isEmpty } from "lodash";
import { flowResult } from "mobx";

export type IAccountScreenProps = {
  coordinator: DashboardCoordinator;
};

export const AccountScreen: React.FC<IAccountScreenProps> = observer(
  ({ coordinator }) => {
    const [{ clearToken, accessToken, profile }] = useState(SessionStore);

    const { colors, images } = useResources();

    const onStartPress = React.useCallback(
      () => coordinator.toAuthScreen(),
      []
    );

    const onLogOutPress = () => {
      flowResult(clearToken());
    };

    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 18,
            paddingHorizontal: 12,
            backgroundColor: colors.primary,
          }}
        >
          <SVGImage
            source={images.svg.ic_account}
            color={colors.background}
            style={{ width: 24, height: 24, marginRight: 12 }}
          />
          <Text
            style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            アカウント
          </Text>
        </View>

        {accessToken && profile ? (
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 36,
                paddingHorizontal: 12,
              }}
            >
              <Image
                source={{
                  uri: profile.profilePhoto?.medium?.url
                    ? profile.profilePhoto?.medium?.url
                    : `https://avatars.dicebear.com/api/identicon/${profile.id}.png`,
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(230,230,230,1)",
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  marginRight: 12,
                }}
              />
              <View style={{ flexGrow: 1 }}>
                <Text
                  style={{
                    color: colors.textVariant,
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  {profile.lastName} {profile.firstName}
                </Text>
                <Text
                  style={{
                    color: colors.textVariant,
                    fontSize: 12,
                    paddingTop: 4,
                  }}
                >
                  {profile.email}
                </Text>
              </View>
            </View>
            <Touchable
              style={{
                paddingHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                coordinator.toAccountDetailScreen("navigate", { profile });
              }}
            >
              <SVGImage
                source={images.svg.user}
                color={colors.textVariant}
                style={{ width: 20, height: 20, marginRight: 24 }}
              />
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                アカウント
              </Text>
            </Touchable>
            <Touchable
              style={{
                paddingHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                coordinator.toAccountPaymentMethodScreen("navigate", {
                  profile,
                  accessToken,
                });
              }}
            >
              <SVGImage
                source={images.svg.credit_card}
                color={colors.textVariant}
                style={{ width: 20, height: 20, marginRight: 24 }}
              />
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                お支払方法
              </Text>
            </Touchable>
            <Touchable
              style={{
                paddingHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                coordinator.toAccountSubscriptionScreen("navigate", {});
              }}
            >
              <SVGImage
                source={images.svg.calendar_days}
                color={colors.textVariant}
                style={{ width: 20, height: 20, marginRight: 24 }}
              />
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                サブスクリプション
              </Text>
            </Touchable>
            <Touchable
              style={{
                paddingHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                coordinator.toAccountEditScreen("navigate");
              }}
            >
              <SVGImage
                source={images.svg.cog_6_tooth}
                color={colors.textVariant}
                style={{ width: 20, height: 20, marginRight: 24 }}
              />
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                設定
              </Text>
            </Touchable>
            <Touchable
              style={{
                paddingHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                coordinator.toAccountPasswordChangeScreen("navigate");
              }}
            >
              <SVGImage
                source={images.svg.cog_6_tooth}
                color={colors.textVariant}
                style={{ width: 20, height: 20, marginRight: 24 }}
              />
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                パスワード修正
              </Text>
            </Touchable>
            <Touchable
              style={{
                paddingHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                coordinator.toAccountDeactivateScreen("navigate");
              }}
            >
              <SVGImage
                source={images.svg.cog_6_tooth}
                color={colors.textVariant}
                style={{ width: 20, height: 20, marginRight: 24 }}
              />
              <Text
                style={{
                  color: colors.textVariant,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                アカウント削除
              </Text>
            </Touchable>
            <View
              style={{
                paddingHorizontal: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "rgba(230,230,230,1)",
              }}
            >
              <Touchable
                onPress={() => {
                  onLogOutPress();
                }}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                    color: colors.background,
                    textAlign: "center",
                  }}
                >
                  ログアウト
                </Text>
              </Touchable>
            </View>
          </ScrollView>
        ) : (
          <></>
        )}

        {!accessToken && isEmpty(profile) ? (
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 10,
              paddingVertical: 15,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                marginHorizontal: 32,
                marginVertical: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  aspectRatio: 1,
                  width: 60,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  marginTop: 16,
                }}
              >
                <SVGImage
                  style={{ aspectRatio: 1, width: 30, margin: 5 }}
                  color={colors.background}
                  source={images.svg.user}
                />
              </View>
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  ログインまたは登録
                </Text>
                <Text
                  style={{
                    color: colors.textVariant,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  アプリサービスを利用するにはログインしてください。
                  または、アカウントをお持ちでない場合は登録してください。
                </Text>
              </View>
              <Touchable onPress={onStartPress}>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: colors.background,
                    }}
                  >
                    ログインまたは登録
                  </Text>
                </View>
              </Touchable>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
);
