import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
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

const deactivationReason = [
  {
    label: "借りたいスペースが見つからない",
    value: "借りたいスペースが見つからない",
  },
  {
    label: "アプリ(サイト)が使いづらい",
    value: "アプリ(サイト)が使いづらい",
  },
  {
    label: "利用する予定が無くなった",
    value: "利用する予定が無くなった",
  },
  {
    label: "その他",
    value: "その他",
  },
];

export const AccountDeactivateScreen: React.FC<IAccountEditScreenProps> =
  observer(({ coordinator }) => {
    const headerHeight = useHeaderHeight();
    const [password, setPassword] = useState<string>("");
    const [selectedReason, setSelectedReason] = useState<string[]>([]);
    const [otherReason, setOtherReason] = useState("");
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
        Alert.alert("エラー", "パスワードは 6 文字以上にする必要があります");
        return;
      }
      if (selectedReason.length === 0) {
        Alert.alert("エラー", "アカウント削除したい理由を選択してください");
        return;
      }

      if (selectedReason.includes("その他") && otherReason.trim() === "") {
        Alert.alert("エラー", "アカウント削除したいその他理由を入力して下さい");
        return;
      }

      const reason = selectedReason.includes("その他")
        ? `${selectedReason
            .filter((value) => value !== "その他")
            .join("、")}、${otherReason}`
        : `${selectedReason.join("、")}`;

      deactivate({
        variables: { input: { password, reason } },
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
                color: colors.textVariant,
                fontSize: 16,
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              アカウント削除したい理由をお聞かせください
            </Text>
            <View>
              {deactivationReason.map(({ value, label }, index) => (
                <View
                  key={index.toString()}
                  style={{ flexDirection: "row", marginVertical: 6 }}
                >
                  <Checkbox
                    value={selectedReason.includes(value) ? true : false}
                    onValueChange={() => {
                      if (selectedReason.includes(value)) {
                        setSelectedReason(
                          selectedReason.filter((reason) => value !== reason)
                        );
                      } else {
                        setSelectedReason([...selectedReason, value]);
                      }
                    }}
                    disabled={loading}
                    color={colors.primary}
                  />
                  <Text style={{ marginLeft: 8, color: colors.textVariant }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
            {selectedReason.includes("その他") && (
              <View style={{ marginTop: 18 }}>
                <TextInput
                  placeholder="その他の理由を入力してください"
                  value={otherReason}
                  onChangeText={(text) => {
                    setOtherReason(text);
                  }}
                  label="その他の理由"
                  maxLength={100}
                  disabled={loading}
                />
              </View>
            )}
          </View>
          <View
            style={{
              marginTop: 12,
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
                  textAlign: "center",
                }}
              >
                ※この操作は元には戻せません。
              </Text>
            </View>
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
