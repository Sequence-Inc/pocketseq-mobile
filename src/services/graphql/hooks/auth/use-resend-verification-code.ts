import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { isEmpty } from "lodash";
import { QueryHook } from "../../types";

export type VerifyResendCodeInput = {
  email: string;
};

export type VerifyResendCodeVariables = VerifyResendCodeInput;

export type VerifyResendCodeResult = {
  message: string;
  action: string;
};

export const RESEND_VERIFICATION_CODE = gql`
  query ResendVerificationCode($email: String!) {
    resendVerificationCode(email: $email) {
      message
      action
    }
  }
`;

export const useResendVerificationCode: any = () => {
  const [query, result] = useLazyQuery(RESEND_VERIFICATION_CODE);

  const handleResendCode = async ({ email }: VerifyResendCodeInput) => {
    if (isEmpty(email)) throw new Error("Must send have email");

    const resendCodeResult = await query({
      variables: {
        email,
      },
    });

    return resendCodeResult;
  };
  return [handleResendCode, result];
};
