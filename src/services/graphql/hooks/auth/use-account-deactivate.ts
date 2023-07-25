import { gql, useMutation } from "@apollo/client";

import { MutationHook } from "../../types";

export type AccountDeactivateInput = {
  password: string;
};

export type AccountDeactivateVariables = {
  input: AccountDeactivateInput;
};

export type AccountDeactivateResult = {
  message: string;
  action: string;
};

export const DEACTIVATE_ACCOUNT = gql`
  mutation DeactivateAccount($input: DeactivateAccountInput!) {
    deactivateAccount(input: $input) {
      message
    }
  }
`;

export const useAccountDeactivate: MutationHook<
  AccountDeactivateResult,
  AccountDeactivateInput
> = () => {
  let [mutation, result] = useMutation<
    AccountDeactivateResult,
    AccountDeactivateVariables
  >(DEACTIVATE_ACCOUNT);
  async function deactivateAccount(input: AccountDeactivateInput) {
    const accountDeactivateResult = await mutation({
      variables: { input },
    });

    return accountDeactivateResult;
  }
  return [deactivateAccount, result];
};
