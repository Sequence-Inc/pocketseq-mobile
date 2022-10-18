import { gql, useLazyQuery } from "@apollo/client";
import { ChatObject } from "../../../domains";
import { QueryHook } from "../../types";

export interface MyChatsResult {
  myChats: ChatObject[];
}

const MY_CHATS = gql`
  query MyChats {
    myChats {
      id
      type
      members {
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
      messages {
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
      createdAt
      updatedAt
    }
  }
`;

export const useMyChats: QueryHook<MyChatsResult, any, true> = () => {
  const [query, result] = useLazyQuery<MyChatsResult>(MY_CHATS, {
    fetchPolicy: "no-cache",
  });
  async function myChats() {
    return await query();
  }
  return [myChats, result];
};
