import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { getSettings, saveSettings, Settings } from "../lib/storage";
import { scheduleNotifications } from "../lib/notifications";

export default function SettingsScreen() {
  const router = useRouter();
  const [hour1, setHour1] = useState("13");
  const [min1, setMin1] = useState("00");
  const [hour2, setHour2] = useState("20");
  const [min2, setMin2] = useState("00");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    getSettings().then((s) => {
      setHour1(String(s.notificationTime1.hour));
      setMin1(String(s.notificationTime1.minute).padStart(2, "0"));
      setHour2(String(s.notificationTime2.hour));
      setMin2(String(s.notificationTime2.minute).padStart(2, "0"));
      setEnabled(s.notificationsEnabled);
    });
  }, []);

  const handleSave = async () => {
    const h1 = parseInt(hour1, 10);
    const m1 = parseInt(min1, 10);
    const h2 = parseInt(hour2, 10);
    const m2 = parseInt(min2, 10);

    if (
      [h1, m1, h2, m2].some(isNaN) ||
      h1 < 0 || h1 > 23 || h2 < 0 || h2 > 23 ||
      m1 < 0 || m1 > 59 || m2 < 0 || m2 > 59
    ) {
      Alert.alert("Invalid time", "Hours: 0-23, Minutes: 0-59");
      return;
    }

    const settings: Settings = {
      notificationTime1: { hour: h1, minute: m1 },
      notificationTime2: { hour: h2, minute: m2 },
      notificationsEnabled: enabled,
    };
    await saveSettings(settings);
    await scheduleNotifications(settings);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notification Times</Text>

      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>Reminder 1</Text>
        <View style={styles.timeInputs}>
          <TextInput
            style={styles.timeInput}
            value={hour1}
            onChangeText={setHour1}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            value={min1}
            onChangeText={setMin1}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>Reminder 2</Text>
        <View style={styles.timeInputs}>
          <TextInput
            style={styles.timeInput}
            value={hour2}
            onChangeText={setHour2}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            value={min2}
            onChangeText={setMin2}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>

      <Text style={styles.timeHint}>Use 24-hour format (e.g. 13:00 = 1 PM)</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.timeLabel}>Notifications enabled</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeLabel: { fontSize: 16, color: "#333" },
  timeInputs: { flexDirection: "row", alignItems: "center" },
  timeInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: "600",
    width: 50,
    textAlign: "center",
  },
  colon: { fontSize: 18, fontWeight: "600", marginHorizontal: 4 },
  timeHint: { fontSize: 13, color: "#888", marginBottom: 16, marginLeft: 4 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 24,
  },
  saveBtn: {
    backgroundColor: "#4A90D9",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
