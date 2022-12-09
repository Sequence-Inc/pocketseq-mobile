import { gql, useMutation } from "@apollo/client";
import { Profile } from "../../../domains";
import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type LoginInput = {
  email: string;
  password: string;
  deviceID?: string;
};
export type SocialLoginInput = {
  provider: "facebook" | "google";
  providerAccountId: string;
  id_token: string;
};

export type LoginVariables = {
  input: LoginInput;
};
export type SocialLoginVariables = {
  input: SocialLoginInput;
};

export type LoginResult = {
  login: {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
  };
};
export type SocialLoginResult = {
  socialLogin: {
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
const SOCIAL_LOGIN = gql`
  mutation socialLogin($input: SocialLoginInput!) {
    socialLogin(input: $input) {
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
  async function login({ email, password, deviceID }: LoginInput) {
    if (isEmpty(email) || isEmpty(password))
      throw new Error("Both email and password are required!!");
    const loginResult = await mutation({
      variables: { input: { email, password, deviceID } },
      fetchPolicy: "no-cache",
    });

    return loginResult;
  }
  return [login, result];
};

export const useSocialLogin: MutationHook<
  SocialLoginResult,
  SocialLoginInput
> = () => {
  let [mutation, result] = useMutation<SocialLoginResult, SocialLoginVariables>(
    SOCIAL_LOGIN
  );
  async function socialLogin({
    provider,
    providerAccountId,
    id_token,
  }: SocialLoginInput) {
    const socialLoginResult = await mutation({
      variables: { input: { provider, providerAccountId, id_token } },
      fetchPolicy: "no-cache",
    });

    return socialLoginResult;
  }
  return [socialLogin, result];
};
