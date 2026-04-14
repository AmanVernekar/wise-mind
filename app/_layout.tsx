import { Stack } from "expo-router";
import { useEffect } from "react";
import { getSettings } from "../lib/storage";
import { requestPermissions, scheduleNotifications } from "../lib/notifications";

export default function Layout() {
  useEffect(() => {
    (async () => {
      const granted = await requestPermissions();
      if (granted) {
        const settings = await getSettings();
        await scheduleNotifications(settings);
      }
    })();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#4A90D9" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Wise Mind" }} />
      <Stack.Screen name="new-entry" options={{ title: "New Entry" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
