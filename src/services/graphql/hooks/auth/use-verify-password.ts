import { gql, useMutation } from "@apollo/client";

import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type VerifyResetPasswordInput = {
  email: string;
  code: string;
};

export type VerifyResetPasswordVariables = {
  input: VerifyResetPasswordInput;
};

export type VerifyResetPasswordResult = {
  message: string;
  action: string;
};

export const VERIFY_RESET_PASSWORD_REQUEST = gql`
  mutation VerifyResetPasswordRequest($input: VerifyResetPasswordRequestInput!) {
    verifyResetPasswordRequest(input: $input) {
      message
      action
    }
  }
`;

export const useVerifyPasswordResetCode: MutationHook<VerifyResetPasswordResult, VerifyResetPasswordInput> = () => {
  const [mutation, result] = useMutation(VERIFY_RESET_PASSWORD_REQUEST);

  const handleVerifyResetCode = async ({ email, code }: VerifyResetPasswordInput) => {
    if (isEmpty(email) || isEmpty(code)) throw new Error("Must send passcode.");

    const verificationResult = await mutation({
      variables: {
        input: {
          email,
          code: Number(code),
        },
      },
    });

    return verificationResult;
  };
  return [handleVerifyResetCode, result];
};
