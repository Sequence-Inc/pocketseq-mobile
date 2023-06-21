import { useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatObject } from "../../services/domains";
import { SessionStore } from "../../services/storage";
import { isEmpty } from "lodash";
import React, { useMemo, useState } from "react";
import { useResources } from "../../resources";
import ChatCoordinator from "./chat-coordinator";
import { ChatScreen } from "./screens";
import { HeaderLeftButton } from "../../widgets/header-left-button";

type ChatStackParamList = {
  "chat-screen": undefined;
};

type ChatStackProps = {
  chatCoordinator: () => ChatCoordinator;
};

const { Group, Navigator, Screen } =
  createNativeStackNavigator<ChatStackParamList>();

export default function ChatStack({ chatCoordinator }: ChatStackProps) {
  const { colors } = useResources();
  const coordinator = chatCoordinator();
  const route = useRoute();

  const [{ accessToken, profile }] = useState(SessionStore);

  const chatObject = useMemo<ChatObject>(
    () => (route.params as any)?.chatObject,
    []
  );
  const recipient = useMemo<{
    recipientId: string;
    recipientName: string;
  }>(() => route.params as any, []);

  const otherMember = useMemo(() => {
    if (accessToken && profile) {
      if (chatObject) {
        const members = chatObject.members.filter(
          ({ accountId }) => accountId !== profile.id
        );
        console.log(members);

        if (!isEmpty(members)) return members[0];
      }
    }
    return undefined;
  }, [accessToken, chatObject, profile, recipient]);

  const otherMemberName = useMemo<string>(() => {
    if (otherMember)
      return (
        otherMember.name || `${otherMember.firstName} ${otherMember.lastName}`
      );
    else if (recipient) return recipient.recipientName;
    return "";
  }, [otherMember]);

  return (
    <Navigator
      initialRouteName="chat-screen"
      screenOptions={{
        // headerBackTitleVisible: false,
        // headerTitleAlign: "center",
        headerBackTitleVisible: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTitleAlign: "center",
        headerTitleStyle: { color: colors.background },
        headerLeft: (props) => {
          return (
            <HeaderLeftButton
              headerButtonProps={props}
              coordinator={coordinator}
            />
          );
        },
      }}
    >
      <Group
        screenOptions={{
          headerShown: true,
          title: otherMemberName,
          headerTitleAlign: "left",
        }}
      >
        <Screen name="chat-screen">
          {(props) => (
            <ChatScreen
              {...props}
              coordinator={coordinator}
              chatObject={chatObject}
              recepientId={recipient.recipientId}
            />
          )}
        </Screen>
      </Group>
    </Navigator>
  );
}
