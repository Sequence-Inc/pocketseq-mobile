import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import { observer } from "mobx-react";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import { Profile } from "../../../services/domains";
import { SessionStore } from "../../../services/storage";
import { Touchable } from "../../../widgets/touchable";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text } from "react-native";

export interface IAccountDetailScreenProps {
  coordinator: AccountCoordinator;
}

export interface IAccountDetailScreenParams {
  profile: Profile;
  accessToken: string;
}

export const AccountDetailScreen: React.FC<IAccountDetailScreenProps> =
  observer(({ coordinator }) => {
    const [{ profile }] = useState(SessionStore);
    const headerHeight = useHeaderHeight();
    const { colors } = useResources();

    return (
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{
          backgroundColor: colors.background,
          paddingTop: headerHeight,
          flex: 1,
        }}
      >
        <ScrollView
          style={{ backgroundColor: colors.background, borderRadius: 10 }}
        >
          <View
            style={{
              paddingHorizontal: 12,
              paddingTop: 24,
            }}
          >
            <Text
              style={{
                color: colors.textVariant,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              メール
            </Text>
            <Text
              style={{
                flexGrow: 1,
                color: colors.textVariant,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {profile?.email}
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
            <Text
              style={{
                color: colors.textVariant,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              性
            </Text>
            <Text
              style={{
                flexGrow: 1,
                color: colors.textVariant,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {profile?.lastName}
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
            <Text
              style={{
                color: colors.textVariant,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              名
            </Text>
            <Text
              style={{
                flexGrow: 1,
                color: colors.textVariant,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {profile?.firstName}
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
            <Text
              style={{
                color: colors.textVariant,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              性 (カナ)
            </Text>
            <Text
              style={{
                flexGrow: 1,
                color: colors.textVariant,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {profile?.lastNameKana}
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
            <Text
              style={{
                color: colors.textVariant,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              名 (カナ)
            </Text>
            <Text
              style={{
                flexGrow: 1,
                color: colors.textVariant,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {profile?.firstNameKana}
            </Text>
          </View>
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
                // TODO: Go to profile edit view
                coordinator.toAccountEditScreen("replace");
              }}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.backgroundVariant,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: colors.textVariant,
                  textAlign: "center",
                }}
              >
                プロフィールを更新
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  });
