import { gql, useMutation } from "@apollo/client";

import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type ResetPasswordInput = {
  email: string;
  newPassword: string;
  code: string;
};

export type ResetPasswordVariables = {
  input: ResetPasswordInput;
};

export type ResetPasswordResult = {
  message: string;
  action: string;
};

export const RESET_PASSWORD = gql`
  mutation ResetPasswordRequest($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
      action
    }
  }
`;

export const useResetPassword: MutationHook<ResetPasswordResult, ResetPasswordInput> = () => {
  const [mutation, result] = useMutation(RESET_PASSWORD);

  const handleVerifyResetCode = async ({ email, newPassword, code }: ResetPasswordInput) => {
    if (isEmpty(email) || isEmpty(code)) throw new Error("Must send passcode.");

    const verificationResult = await mutation({
      variables: {
        input: {
          email,
          code: Number(code),
          newPassword,
        },
      },
    });

    return verificationResult;
  };
  return [handleVerifyResetCode, result];
};
