import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerNotifications() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      console.log("Notification disabled");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("-".repeat(50));
    console.log("EXPO PUSH NOTIFICATION TOKEN");
    console.log("-".repeat(50));
    console.log(token);
    console.log("-".repeat(50));
  } else {
    // alert("Must use physical device for Push Notifications");
    console.log("-".repeat(50));
    console.log("RUNNING ON SIMULATOR - NOTIFICATIONS DO NOT WORK");
    console.log("-".repeat(50));
  }

  return token;
}
