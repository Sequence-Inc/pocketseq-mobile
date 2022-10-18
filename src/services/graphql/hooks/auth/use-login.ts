import { gql, useMutation } from "@apollo/client";
import { Profile } from "../../../domains";
import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginVariables = {
  input: LoginInput;
};

export type LoginResult = {
  login: {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
  };
};

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      profile {
        __typename
        ... on UserProfile {
          id
          accountId
          email
          emailVerified
          firstName
          lastName
          firstNameKana
          lastNameKana
          phoneNumber
          roles
          address {
            id
            addressLine1
          }
          profilePhoto {
            id
            medium {
              width
              height
              url
            }
          }
        }
      }
    }
  }
`;

export const useLogin: MutationHook<LoginResult, LoginInput> = () => {
  let [mutation, result] = useMutation<LoginResult, LoginVariables>(LOGIN);
  async function login({ email, password }: LoginInput) {
    if (isEmpty(email) || isEmpty(password))
      throw new Error("Both email and password are required!!");
    const loginResult = await mutation({
      variables: { input: { email, password } },
      fetchPolicy: "no-cache",
    });

    return loginResult;
  }
  return [login, result];
};
