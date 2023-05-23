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
      <ScrollView
        style={{ backgroundColor: colors.background, flex: 1 }}
        keyboardDismissMode="on-drag"
      >
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
          <>
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
                サブスクリップション
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
          </>
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
            <Touchable
              onPress={onStartPress}
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  aspectRatio: 1,
                  backgroundColor: colors.secondaryVariant,
                  borderRadius: 32,
                  height: 64,
                  marginHorizontal: 15,
                }}
              />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    color: colors.textVariant,
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  ログインまたは登録
                </Text>
                <Text style={{ color: colors.textVariant, fontSize: 16 }}>
                  アプリサービスを利用するにはログインしてください。
                  または、アカウントをお持ちでない場合は登録してください。
                </Text>
              </View>
              <SVGImage
                style={{ aspectRatio: 1, width: 25, margin: 5 }}
                color={colors.textVariant}
                source={images.svg.ic_caret_right}
              />
            </Touchable>
          </View>
        ) : (
          <></>
        )}

        {/* {profile && (
        <View style={{ backgroundColor: colors.background, borderRadius: 10, paddingVertical: 15 }}>
          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", marginBottom: 12 }}>
            <View
              style={{
                aspectRatio: 1,
                backgroundColor: colors.secondaryVariant,
                borderRadius: 32,
                height: 40,
                marginHorizontal: 15,
              }}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ color: colors.textVariant, fontSize: 18, marginBottom: 4 }}>
                {profile.lastName} {profile.firstName}
              </Text>
              <Text style={{ color: colors.textVariant, fontSize: 12 }}>{profile.email}</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(240,240,240,1)",
              paddingTop: 12,
            }}
          >
            <Text style={{ color: colors.textVariant, fontSize: 14, fontWeight: "700" }}>Email</Text>
            <Text style={{ flexGrow: 1, color: colors.textVariant, fontSize: 16, marginBottom: 4 }}>
              {profile.email}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(240,240,240,1)",
              paddingTop: 12,
            }}
          >
            <Text style={{ color: colors.textVariant, fontSize: 14, fontWeight: "700" }}>Last name</Text>
            <Text style={{ flexGrow: 1, color: colors.textVariant, fontSize: 16, marginBottom: 4 }}>
              {profile.lastName}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(240,240,240,1)",
              paddingTop: 12,
            }}
          >
            <Text style={{ color: colors.textVariant, fontSize: 14, fontWeight: "700" }}>First name</Text>
            <Text style={{ flexGrow: 1, color: colors.textVariant, fontSize: 16, marginBottom: 4 }}>
              {profile.firstName}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(240,240,240,1)",
              paddingTop: 12,
            }}
          >
            <Text style={{ color: colors.textVariant, fontSize: 14, fontWeight: "700" }}>Last name (kana)</Text>
            <Text style={{ flexGrow: 1, color: colors.textVariant, fontSize: 16, marginBottom: 4 }}></Text>
          </View>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(240,240,240,1)",
              paddingTop: 12,
            }}
          >
            <Text style={{ color: colors.textVariant, fontSize: 14, fontWeight: "700" }}>First name (kana)</Text>
            <Text style={{ flexGrow: 1, color: colors.textVariant, fontSize: 16, marginBottom: 4 }}></Text>
          </View>
        </View>
      )} */}
        {/* {!profile && (
        <View style={{ backgroundColor: colors.background, borderRadius: 10, paddingVertical: 15 }}>
          <Touchable
            onPress={onStartPress}
            style={{ alignItems: "center", flexDirection: "row", justifyContent: "center" }}
          >
            <View
              style={{
                aspectRatio: 1,
                backgroundColor: colors.secondaryVariant,
                borderRadius: 32,
                height: 64,
                marginHorizontal: 15,
              }}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ color: colors.text, fontSize: 20, marginBottom: 4 }}>Login / Signup</Text>
              <Text style={{ color: colors.textVariant, fontSize: 12 }}>
                Please login to use the app services. Or create an account if you don't have one.
              </Text>
            </View>
            <SVGImage
              style={{ aspectRatio: 1, width: 25, margin: 5 }}
              color={colors.textVariant}
              source={images.svg.ic_caret_right}
            />
          </Touchable>
        </View>
      )} */}
      </ScrollView>
    );
  }
);
