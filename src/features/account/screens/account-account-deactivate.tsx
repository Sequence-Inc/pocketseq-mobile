import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import { observer } from "mobx-react";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import { Touchable } from "../../../widgets/touchable";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Alert, ActivityIndicator } from "react-native";
import { TextInput } from "../../../widgets/text-input";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_ACCOUNT } from "../../../services/graphql/hooks/auth/use-account-deactivate";
import { SessionStore } from "../../../services/storage";
import { flowResult } from "mobx";

export interface IAccountEditScreenProps {
  coordinator: AccountCoordinator;
}

export const AccountDeactivateScreen: React.FC<IAccountEditScreenProps> =
  observer(({ coordinator }) => {
    const headerHeight = useHeaderHeight();
    const [password, setPassword] = useState<string>("");
    const [{ clearToken }] = useState(SessionStore);

    const { colors } = useResources();

    const [deactivate, { loading }] = useMutation(DEACTIVATE_ACCOUNT, {
      onError: (error) => {
        Alert.alert(
          "エラー",
          error.graphQLErrors[0].message || "エラーが発生しました"
        );
      },
      onCompleted: (data) => {
        Alert.alert(
          data.deactivateAccount.message || "アカウントは削除されました",
          "アカウントは削除されました",
          [
            {
              text: "Okay",
              onPress: () => {
                flowResult(clearToken());
                coordinator.toAuthScreen("replace");
              },
            },
          ]
        );
      },
    });

    const handleAccountDeactivation = async () => {
      if (password.length < 6) {
        return;
      }
      deactivate({
        variables: { input: { password } },
      });
    };

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
              paddingTop: 18,
              paddingBottom: 6,
            }}
          >
            <Text
              style={{
                color: "#E02424",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              ※警告！ この操作は元に戻せません。
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(240,240,240,1)",
              paddingTop: 12,
            }}
          >
            <TextInput
              disabled={loading}
              containerStyle={{ margin: 12, opacity: loading ? 0.5 : 1 }}
              label={`パスワード`}
              placeholder={`パスワード`}
              onChangeText={(val) => {
                setPassword(val);
              }}
              value={password}
              secureTextEntry
            />
            <Touchable
              onPress={handleAccountDeactivation}
              style={{
                backgroundColor: loading ? "#F98080" : "#E02424",
                borderWidth: 1,
                borderColor: loading ? "#F98080" : "#E02424",
                marginHorizontal: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 6,
                opacity: loading ? 0.5 : 1,
              }}
              disabled={loading}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                アカウントを削除
              </Text>
            </Touchable>
          </View>
          {loading && (
            <View style={{ marginTop: 24 }}>
              <ActivityIndicator />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  });
