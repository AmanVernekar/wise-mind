import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Settings } from "./storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleNotifications(
  settings: Settings
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.notificationsEnabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wise Mind",
      body: "Time to reflect. How are you feeling?",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.notificationTime1.hour,
      minute: settings.notificationTime1.minute,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wise Mind",
      body: "Take a moment to journal your thoughts.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.notificationTime2.hour,
      minute: settings.notificationTime2.minute,
    },
  });
}
