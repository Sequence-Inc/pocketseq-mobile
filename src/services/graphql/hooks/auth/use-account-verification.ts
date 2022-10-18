import { gql, useMutation } from "@apollo/client";
import { Profile } from "../../../domains";
import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type AccountVerificationInput = {
  email: string;
  code: number;
};

export type AccountVerificationVariables = {
  input: AccountVerificationInput;
};

export type VerificationResult = {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
};

const VerifyEmail = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      message
      action
    }
  }
`;

export const useVerifyEmail: MutationHook<
  VerificationResult,
  AccountVerificationInput
> = () => {
  let [mutation, result] = useMutation<
    VerificationResult,
    AccountVerificationVariables
  >(VerifyEmail);
  async function verifyEmail(input: AccountVerificationInput) {
    const verifyEmailResult = await mutation({
      variables: {
        input: {
          email: input.email,
          code: Number(input.code),
        },
      },
      fetchPolicy: "no-cache",
    });

    console.log("verify email: result", verifyEmailResult);
    return verifyEmailResult;
  }
  return [verifyEmail, result];
};
