import { ChatObject, MessageObject, Profile } from "../../../services/domains";
import {
  useCreateNewChat,
  useMessagesByChat,
  useSendMessage,
} from "../../../services/graphql";
import { SessionStore } from "../../../services/storage";
import { SVGImage } from "../../../widgets/svg-image";
import { TextInput } from "../../../widgets/text-input";
import { Touchable } from "../../../widgets/touchable";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useResources } from "../../../resources";
import ChatCoordinator from "../chat-coordinator";

export type IChatScreenProps = {
  coordinator: ChatCoordinator;
  chatObject?: ChatObject;
  recepientId?: string;
};

export type IMessageItemProps = {
  currentProfile: Profile;
  coordinator: ChatCoordinator;
  messageObject: Partial<MessageObject>;
};

export type MessageItemData = {
  isSelfSender: boolean;
  senderImage: string;
  message: string;
  messageDate: string;
};

function dateString(date: Date | number | undefined): string {
  if (!date) return " - ";
  const currentDate = moment(new Date());
  let messageSentDate = moment(new Date(date));
  const years = currentDate.diff(messageSentDate, "years");
  if (years > 0) return `${Math.floor(years)} yrs`;
  const months = currentDate.diff(messageSentDate, "months");
  if (months > 0) return `${Math.floor(months)} mths`;
  const days = currentDate.diff(messageSentDate, "days");
  if (days > 0) return `${Math.floor(days)} days`;
  const hours = currentDate.diff(messageSentDate, "hours");
  if (hours > 0) return `${Math.floor(hours)} hrs`;
  const minutes = currentDate.diff(messageSentDate, "minutes");
  if (minutes > 0) return `${Math.floor(minutes)} mins`;
  const seconds = currentDate.diff(messageSentDate, "seconds");
  if (seconds > 0) return `${Math.floor(seconds)} secs`;
  console.log(years, months, hours, minutes, seconds);
  return ` few secs ago `;
}

export const MessageItem: React.FC<IMessageItemProps> = ({
  coordinator,
  currentProfile,
  messageObject,
}) => {
  const { colors, images } = useResources();

  const messageData = useMemo<Partial<MessageItemData>>(() => {
    if (!messageObject) return {};

    return {
      isSelfSender: messageObject.sender?.accountId === currentProfile.id,
      message: messageObject.message,
      messageDate: dateString(messageObject.updatedAt),
      senderImage: messageObject.sender?.profilePhoto?.medium.url,
    };
  }, [messageObject, currentProfile]);

  if (!messageData) return <></>;

  return (
    <View
      style={{
        flexDirection: messageData.isSelfSender ? "row-reverse" : "row",
        padding: 10,
      }}
    >
      <Image
        source={
          messageData.senderImage
            ? { uri: messageData.senderImage }
            : images.png.ic_adaptive
        }
        style={{ width: 50, height: 50, borderRadius: 16 }}
      />
      <View
        style={{
          maxWidth: "60%",
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: messageData.isSelfSender
            ? colors.secondary
            : colors.background,
          borderRadius: 25,
          marginHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <Text>{messageData.message}</Text>
      </View>
      <Text style={{ fontSize: 10, padding: 10, alignSelf: "center" }}>
        {messageData.messageDate}
      </Text>
    </View>
  );
};

const ItemSeperator: React.FC = () => {
  const { colors } = useResources();
  return (
    <View
      style={{
        backgroundColor: colors.backgroundVariant,
        height: 1,
        width: "100%",
      }}
    />
  );
};

export const ChatScreen: React.FC<IChatScreenProps> = ({
  coordinator,
  chatObject,
  recepientId,
}) => {
  const { colors, images } = useResources();

  const [createNewChatMutation, createNewChatResult] = useCreateNewChat();
  const [sendMessageMutation, sendMessageResult] = useSendMessage();
  const [messagesByChatQuery, messagesByChatResult] = useMessagesByChat();

  const messages = useMemo<Partial<MessageObject>[]>(() => {
    if (messagesByChatResult.data?.messagesByChat)
      return messagesByChatResult.data.messagesByChat;
    if (chatObject) return chatObject.messages;
    return [];
  }, [messagesByChatResult]);

  const [newMessage, setNewMessage] = useState<string>();

  const [{ accessToken, profile }] = useState(SessionStore);

  const chatId = useMemo(() => {
    return createNewChatResult.data?.createNewChat.chatId || chatObject?.id;
  }, [createNewChatResult, chatObject]);

  const sendMessage = useCallback(async () => {
    if (newMessage && newMessage.length > 0) {
      console.log(chatId, recepientId);

      if (chatId) {
        const result = await sendMessageMutation({
          chatId,
          message: newMessage,
        });
        console.log(result.data);

        if (result.data?.sendMessage.delivered) {
          setNewMessage(undefined);
          messagesByChat();
        }
      } else if (recepientId) {
        const result = await createNewChatMutation({
          recipientIds: [recepientId],
          message: newMessage,
        });
        console.log(result.data);

        if (result.data?.createNewChat.delivered) {
          setNewMessage(undefined);
          messagesByChat();
        }
      }
    }
  }, [sendMessageResult, createNewChatResult, newMessage, chatId, recepientId]);

  const messagesByChat = useCallback(async () => {
    if (chatId) await messagesByChatQuery({ chatId });
  }, [chatId]);

  if (accessToken && profile) {
    return (
      <View style={{ backgroundColor: colors.backgroundVariant, flex: 1 }}>
        <FlatList
          ItemSeparatorComponent={ItemSeperator}
          data={messages}
          renderItem={({ item }) => (
            <MessageItem
              coordinator={coordinator}
              messageObject={item}
              currentProfile={profile}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={messagesByChatResult.loading}
              onRefresh={messagesByChat}
            />
          }
        />
        <View
          style={{
            flexDirection: "row",
            padding: 12,
            backgroundColor: colors.background,
          }}
        >
          <TextInput
            containerStyle={{
              flex: 1,
              borderRadius: 25,
              backgroundColor: colors.backgroundVariant,
            }}
            value={newMessage}
            editable={!sendMessageResult.loading}
            placeholder={"Type a message here"}
            onChangeText={(text) => {
              text && setNewMessage(text.trim());
            }}
            tint={colors.background}
          />
          <Touchable
            style={{ justifyContent: "center", paddingHorizontal: 10 }}
            onPress={sendMessage}
          >
            {sendMessageResult.loading ? (
              <ActivityIndicator
                color={colors.background}
                style={{
                  borderRadius: 17,
                  backgroundColor: colors.surfaceVariant,
                  width: 34,
                  height: 34,
                }}
              />
            ) : (
              <SVGImage
                source={images.svg.ic_send}
                style={{ width: 34, height: 34 }}
              />
            )}
          </Touchable>
        </View>
      </View>
    );
  }

  return <></>;
};
