import { Profile } from "./profile";

export type ChatType = "SINGLE" | "GROUP";

export type ChatObject = {
  id: string;
  type: ChatType;
  members: Partial<Profile>[];
  messages: Partial<MessageObject>[];
  createdAt: number;
  updatedAt: number;
};

export type MessageObject = {
  id: string;
  message: string;
  sender: Partial<Profile>;
  createdAt: number;
  updatedAt: number;
};
