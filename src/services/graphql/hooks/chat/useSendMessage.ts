import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { MutationHook } from "../../types";

export type SendMessageInput = {
  message: string;
  chatId: string;
};

export type SendMessageVariables = {
  input: SendMessageInput;
};

export type SendMessageResult = {
  sendMessage: {
    chatId: string;
    messageId: string;
    delivered: boolean;
  };
};

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      chatId
      messageId
      delivered
    }
  }
`;

export const useSendMessage: MutationHook<SendMessageResult, SendMessageInput> = () => {
  const [mutation, result] = useMutation<SendMessageResult, SendMessageVariables>(SEND_MESSAGE);
  async function sendMessage({ message, chatId }: SendMessageInput) {
    if (isEmpty(message) || isEmpty(chatId)) throw new Error("Invalid inputs");
    const sendMessageResult = await mutation({
      variables: { input: { message, chatId } },
      fetchPolicy: "no-cache",
    });
    return sendMessageResult;
  }
  return [sendMessage, result];
};
