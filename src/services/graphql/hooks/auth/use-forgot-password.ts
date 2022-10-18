import { gql, useMutation } from "@apollo/client";

import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type ForgotPaswordInput = {
  email: string;
};

export type ForgotPaswordVariables = {
  email: string;
};

export type ForgotPasswordResult = {
  message: string;
  action?: string;
};

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      action
    }
  }
`;

export const useForgotPassword: MutationHook<ForgotPasswordResult, ForgotPaswordInput> = () => {
  let [mutation, result] = useMutation<ForgotPasswordResult, ForgotPaswordVariables>(FORGOT_PASSWORD);

  async function forgotPassword({ email }: ForgotPaswordInput) {
    if (isEmpty(email)) throw new Error("Must send email address.");
    const forgotPasswordResult = await mutation({
      variables: {
        email,
      },
    });
    return forgotPasswordResult;
  }

  return [forgotPassword, result];
};
