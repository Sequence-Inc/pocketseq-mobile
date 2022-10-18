import { gql, useMutation } from "@apollo/client";
import { Profile } from "../../../domains";

import { MutationHook } from "../../types";

export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
};

export type SignUpVariables = {
  input: SignUpInput;
};

export type SignUpResult = {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
};

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      message
      action
    }
  }
`;

export const useSignup: MutationHook<SignUpResult, SignUpInput> = () => {
  let [mutation, result] = useMutation<SignUpResult, SignUpVariables>(
    REGISTER_USER
  );
  async function signup(input: SignUpInput) {
    const signupResult = await mutation({
      variables: { input },
      fetchPolicy: "no-cache",
    });

    console.log("login: result", signupResult);
    return signupResult;
  }
  return [signup, result];
};
