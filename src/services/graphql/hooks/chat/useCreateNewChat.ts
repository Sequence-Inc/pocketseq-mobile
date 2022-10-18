import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type CreateNewChatInput = {
  message: string;
  recipientIds: string[];
};

export type CreateNewChatVariables = {
  input: CreateNewChatInput;
};

export type CreateNewChatResult = {
  createNewChat: {
    chatId: string;
    messageId: string;
    delivered: boolean;
  };
};

const CREATE_NEW_CHAT = gql`
  mutation CreateNewChat($input: CreateNewChatInput!) {
    createNewChat(input: $input) {
      chatId
      messageId
      delivered
    }
  }
`;

export const useCreateNewChat: MutationHook<CreateNewChatResult, CreateNewChatInput> = () => {
  const [mutation, result] = useMutation<CreateNewChatResult, CreateNewChatVariables>(CREATE_NEW_CHAT);
  async function createNewChat({ message, recipientIds }: CreateNewChatInput) {
    if (isEmpty(message) || isEmpty(recipientIds)) throw new Error("Invalid inputs");
    const createNewChatResult = await mutation({
      variables: { input: { message, recipientIds } },
      fetchPolicy: "no-cache",
    });
    return createNewChatResult;
  }
  return [createNewChat, result];
};
