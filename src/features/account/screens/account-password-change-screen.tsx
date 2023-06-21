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
import { ChangePassword } from "../../../widgets/change-password";

export interface IAccountPasswordChangeScreenProps {
  coordinator: AccountCoordinator;
}

export const AccountPasswordChangeScreen: React.FC<IAccountPasswordChangeScreenProps> =
  observer(({ coordinator }) => {
    const [{ profile, accessToken, refreshToken, saveLogin }] =
      useState(SessionStore);
    const headerHeight = useHeaderHeight();
    const { colors } = useResources();
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
              パスワード修正
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
            <ChangePassword />
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
  });
