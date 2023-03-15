import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import { observer } from "mobx-react";
import { useResources } from "../../../resources";
import AccountCoordinator from "../account-coordinator";
import { SessionStore } from "../../../services/storage";
import { Touchable } from "../../../widgets/touchable";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Alert } from "react-native";
import {
  ProfileUpdateInput,
  useMyProfile,
  useProfileUpdate,
} from "../../../services/graphql";
import { TextInput } from "../../../widgets/text-input";
import { flowResult } from "mobx";

export interface IAccountEditScreenProps {
  coordinator: AccountCoordinator;
}

export const AccountEditScreen: React.FC<IAccountEditScreenProps> = observer(
  ({ coordinator }) => {
    const [{ profile, accessToken, refreshToken, saveLogin }] =
      useState(SessionStore);
    const headerHeight = useHeaderHeight();
    const { colors, strings } = useResources();
    const [form, setForm] = useState<ProfileUpdateInput>({
      id: profile?.id || "",
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      firstNameKana: profile?.firstNameKana || "",
      lastNameKana: profile?.lastNameKana || "",
      dob: profile?.dob || "",
    });

    const [handleUpdate, { loading: updating }] = useProfileUpdate();
    const { myProfile } = useMyProfile();

    const handleFormChange = React.useCallback(
      (val: string, fieldName: string) => {
        setForm((prev) => ({
          ...prev,
          [fieldName]: val,
        }));
      },
      [form]
    );

    const onUpdateProfile = React.useCallback(async () => {
      console.log({ ...form });
      const updated = await handleUpdate({
        ...form,
      });

      if (updated.data) {
        // refetch profile
        const profile = await myProfile();
        if (profile.data) {
          // update store with updated profile data
          await flowResult(
            saveLogin({
              accessToken,
              refreshToken,
              profile: profile.data?.myProfile,
            })
          );
        }
        // show alert
        Alert.alert(`Success`, `プロフィールを更新しました。`, [
          {
            text: "OK",
            style: "default",
            onPress: () => {
              coordinator.goBack();
            },
          },
        ]);

        return;
      }
      if (updated.errors) {
        console.log({ error: updated.errors });
        Alert.alert("Could not update account due to error.");
      }
    }, [form]);

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
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              プロフィールを更新
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
              disabled={updating}
              containerStyle={{ margin: 12, opacity: updating ? 0.5 : 1 }}
              label={`${strings("lastname")}`}
              placeholder={`${strings("lastname")}`}
              onChangeText={(val) => handleFormChange(val, "lastName")}
              value={form.lastName}
            />
            <TextInput
              disabled={updating}
              containerStyle={{ margin: 12, opacity: updating ? 0.5 : 1 }}
              label={`${strings("name")}`}
              placeholder={`${strings("name")}`}
              onChangeText={(val) => handleFormChange(val, "firstName")}
              value={form.firstName}
            />
            <TextInput
              disabled={updating}
              containerStyle={{ margin: 12, opacity: updating ? 0.5 : 1 }}
              label={`${strings("lastname_kana")}`}
              placeholder={`${strings("lastname_kana_example")}`}
              onChangeText={(val) => handleFormChange(val, "lastNameKana")}
              value={form.lastNameKana}
            />
            <TextInput
              disabled={updating}
              containerStyle={{ margin: 12, opacity: updating ? 0.5 : 1 }}
              label={`${strings("name_kana")}`}
              placeholder={`${strings("name_kana")}`}
              onChangeText={(val) => handleFormChange(val, "firstNameKana")}
              value={form.firstNameKana}
            />

            <Touchable
              onPress={onUpdateProfile}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.backgroundVariant,
                marginHorizontal: 12,
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
                保存
              </Text>
            </Touchable>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              marginTop: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(230,230,230,1)",
            }}
          ></View>
        </ScrollView>
      </SafeAreaView>
    );
  }
);
