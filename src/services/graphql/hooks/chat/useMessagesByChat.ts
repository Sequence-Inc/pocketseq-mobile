import { gql, useLazyQuery } from "@apollo/client";
import { MessageObject } from "../../../domains";
import { QueryHook } from "../../types";

export type MessagesByChatVariables = {
  chatId: string;
};

export type MessagesByChatResult = {
  messagesByChat: MessageObject[];
};

const MESSAGES_BY_CHAT = gql`
  query MessagesByChat($chatId: ID!) {
    messagesByChat(chatId: $chatId) {
      id
      message
      sender {
        __typename
        ... on UserProfile {
          id
          accountId
          firstName
          lastName
          profilePhoto {
            id
            medium {
              width
              height
              url
            }
          }
        }
        ... on CompanyProfile {
          id
          accountId
          name
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
      createdAt
      updatedAt
    }
  }
`;

export const useMessagesByChat: QueryHook<
  MessagesByChatResult,
  MessagesByChatVariables,
  true
> = () => {
  const [query, result] = useLazyQuery<
    MessagesByChatResult,
    MessagesByChatVariables
  >(MESSAGES_BY_CHAT, {
    fetchPolicy: "no-cache",
  });
  async function messagesByChat({ chatId }: MessagesByChatVariables) {
    return await query({ variables: { chatId } });
  }
  return [messagesByChat, result];
};
