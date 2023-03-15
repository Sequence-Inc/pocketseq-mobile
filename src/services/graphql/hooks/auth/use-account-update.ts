import { gql, useMutation } from "@apollo/client";

import { MutationHook } from "../../types";

export type ProfileUpdateInput = {
  id: string;
  firstName?: string;
  lastName?: string;
  firstNameKana?: string;
  lastNameKana?: string;
  dob?: string;
  name?: string;
  nameKana?: string;
  registrationNumber?: string;
};

export type ProfileUpdateVariables = {
  input: ProfileUpdateInput;
};

export type ProfileUpdateResult = {
  message: string;
  action: string;
};

const UPDATE_PROFILE = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      message
      action
    }
  }
`;

export const useProfileUpdate: MutationHook<
  ProfileUpdateResult,
  ProfileUpdateInput
> = () => {
  let [mutation, result] = useMutation<
    ProfileUpdateResult,
    ProfileUpdateVariables
  >(UPDATE_PROFILE);
  async function profileUpdate(input: ProfileUpdateInput) {
    const profileUpdateResult = await mutation({
      variables: { input },
      fetchPolicy: "no-cache",
    });

    console.log("updated: result", profileUpdateResult);
    return profileUpdateResult;
  }
  return [profileUpdate, result];
};
