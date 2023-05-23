import { gql, useMutation } from "@apollo/client";

import { MutationHook } from "../../types";

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordVariables = {
  input: ChangePasswordInput;
};

export type ChangePasswordResult = {
  message: string;
  action: string;
};

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      message
    }
  }
`;

export const usePasswordChange: MutationHook<
  ChangePasswordResult,
  ChangePasswordInput
> = () => {
  let [mutation, result] = useMutation<
    ChangePasswordResult,
    ChangePasswordVariables
  >(UPDATE_PASSWORD);
  async function changePassword(input: ChangePasswordInput) {
    const changePasswordResult = await mutation({
      variables: { input },
      fetchPolicy: "no-cache",
    });

    console.log("updated: result", changePasswordResult);
    return changePasswordResult;
  }
  return [changePassword, result];
};
