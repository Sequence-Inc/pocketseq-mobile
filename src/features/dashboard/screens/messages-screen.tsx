import { ChatObject, Profile } from "../../../services/domains";
import { useMyChats } from "../../../services/graphql";
import { SessionStore } from "../../../services/storage";
import { SVGImage } from "../../../widgets/svg-image";
import { Touchable } from "../../../widgets/touchable";
import { isEmpty } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useResources } from "../../../resources";
import DashboardCoordinator from "../dashboard-coordinator";

export type IMessagesScreenProps = {
  coordinator: DashboardCoordinator;
};

export type IChatItemProps = IMessagesScreenProps & {
  currentProfile: Profile | null;
  chatObject: ChatObject;
};

export type ChatItemData = {
  imageUrl: string;
  senderName: string;
  lastMessage: string;
  lastMessageDate: string;
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
  return ` - `;
}

export const ChatItem: React.FC<IChatItemProps> = ({
  chatObject,
  coordinator,
  currentProfile,
}) => {
  const { colors, images } = useResources();

  if (!chatObject || !currentProfile) return <></>;

  const chatData = useMemo<Partial<ChatItemData>>(() => {
    if (isEmpty(chatObject.messages)) return {};
    const lastMessage = chatObject.messages[0];
    const senders = chatObject.members.filter(
      ({ accountId }) => accountId !== currentProfile?.id
    );
    if (isEmpty(senders)) return {};
    const sender = senders[0];
    return {
      imageUrl: sender.profilePhoto?.medium.url,
      lastMessage: lastMessage.message?.slice(0, 35) + "...",
      lastMessageDate: dateString(lastMessage.updatedAt),
      senderName: sender.name ?? `${sender.firstName} ${sender.lastName}`,
    };
  }, [chatObject]);

  return (
    <Touchable
      style={{
        backgroundColor: colors.background,
        padding: 10,
        flexDirection: "row",
      }}
      touchType="none"
      onPress={() => coordinator.toChatScreen("navigate", { chatObject })}
    >
      <Image
        source={
          chatData.imageUrl
            ? { uri: chatData.imageUrl }
            : images.png.ic_adaptive
        }
        style={{ borderRadius: 30, height: 60, width: 60 }}
      />
      <View style={{ flex: 1, justifyContent: "center", marginHorizontal: 10 }}>
        <Text style={{ fontSize: 16, color: colors.primaryVariant }}>
          {chatData.senderName}
        </Text>
        <Text style={{ color: colors.textVariant }}>
          {chatData.lastMessage}
        </Text>
      </View>
      <Text style={{ alignSelf: "center", textAlign: "center", fontSize: 10 }}>
        {chatData.lastMessageDate}
      </Text>
    </Touchable>
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

const EmptyMessageComponent: React.FC = () => {
  return (
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text>メッセージはありません。</Text>
    </View>
  );
};

export const MessagesScreen: React.FC<IMessagesScreenProps> = ({
  coordinator,
}) => {
  const { colors, images } = useResources();

  const [myChatsQuery, myChatsResult] = useMyChats();

  const [{ accessToken, profile }] = useState(SessionStore);

  const fetchMyChats = useCallback(() => {
    if (accessToken) myChatsQuery({});
  }, [accessToken, myChatsResult]);

  useEffect(() => {
    fetchMyChats();
  }, []);

  return (
    <View style={{ backgroundColor: colors.backgroundVariant, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 18,
          paddingHorizontal: 12,
          backgroundColor: colors.primary,
        }}
      >
        <SVGImage
          source={images.svg.ic_chat}
          color={colors.background}
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
        <Text
          style={{
            color: colors.background,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          メッセージ <Text style={{ fontWeight: "400" }}>(Messages)</Text>
        </Text>
      </View>
      <FlatList
        ListEmptyComponent={EmptyMessageComponent}
        ItemSeparatorComponent={ItemSeperator}
        data={myChatsResult.data?.myChats || []}
        renderItem={({ item }) => (
          <ChatItem
            coordinator={coordinator}
            chatObject={item}
            currentProfile={profile}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={myChatsResult.loading}
            onRefresh={fetchMyChats}
          />
        }
      />
    </View>
  );
};
