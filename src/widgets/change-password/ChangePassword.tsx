import { useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import { UPDATE_PASSWORD } from "../../services/graphql";
import { Touchable } from "../touchable";
import { TextInput } from "../text-input";
import { useResources } from "../../resources";
import React from "react";

type Errors = {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean | string;
};

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const { colors } = useResources();

  const handleSubmit = useCallback(async () => {
    let hasError = false;
    // check all fields
    if (currentPassword === "") {
      setErrors((errors) => ({ ...errors, currentPassword: true }));
      hasError = true;
    } else {
      setErrors((errors) => ({ ...errors, currentPassword: false }));
      hasError = false;
    }

    if (newPassword === "") {
      setErrors((errors) => ({ ...errors, newPassword: true }));
      hasError = true;
    } else {
      setErrors((errors) => ({ ...errors, newPassword: false }));
      hasError = false;
    }
    if (confirmPassword === "") {
      setErrors((errors) => ({ ...errors, confirmPassword: true }));
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setErrors((errors) => ({
        ...errors,
        confirmPassword: true,
      }));
      Alert.alert("パスワードが一致しません");
      hasError = true;
    } else {
      setErrors((errors) => ({ ...errors, confirmPassword: false }));
      hasError = false;
    }
    if (hasError) {
      return;
    }

    // all good
    try {
      setLoading(true);

      const result = await updatePassword({
        variables: {
          input: {
            currentPassword,
            newPassword,
          },
        },
      });
      if (result.data?.changePassword?.message) {
        Alert.alert(
          result.data?.changePassword?.message ||
            "Password changed successfully."
        );
      }
    } catch (error) {
      Alert.alert(error?.message || "Error!");
    } finally {
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <View>
      <View>
        <View style={{ margin: 12 }}>
          <TextInput
            label="現在のパスワード"
            error={errors.currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
            }}
            value={currentPassword}
            secureTextEntry={true}
            disabled={loading}
          />
        </View>
        <View style={{ margin: 12 }}>
          <TextInput
            label="新しいパスワード"
            error={errors.newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
            }}
            value={newPassword}
            secureTextEntry={true}
            disabled={loading}
          />
        </View>
        <View style={{ margin: 12 }}>
          <TextInput
            label="パスワード認証"
            error={
              typeof errors.confirmPassword === "boolean"
                ? errors.confirmPassword
                : true
            }
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
            value={confirmPassword}
            secureTextEntry={true}
            disabled={loading}
          />
        </View>
        <Touchable
          onPress={handleSubmit}
          style={{
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.backgroundVariant,
            marginHorizontal: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 6,
          }}
          disabled={loading}
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
    </View>
  );
};
