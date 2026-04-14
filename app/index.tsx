import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Entry, getEntries, deleteEntry } from "../lib/storage";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getEntries().then(setEntries);
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteEntry(id);
          setEntries((prev) => prev.filter((e) => e.id !== id));
        },
      },
    ]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No entries yet.</Text>
          <Text style={styles.emptySubtext}>
            Tap + to add your first reflection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/new-entry?id=${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  hitSlop={8}
                >
                  <Text style={styles.deleteBtn}>✕</Text>
                </Pressable>
              </View>
              <Text style={styles.situation} numberOfLines={2}>
                {item.situation || "(no situation described)"}
              </Text>
            </Pressable>
          )}
        />
      )}

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.settingsBtnText}>⚙</Text>
        </Pressable>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/new-entry")}
        >
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#888" },
  emptySubtext: { fontSize: 14, color: "#aaa", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 13, color: "#4A90D9", fontWeight: "600" },
  deleteBtn: { fontSize: 16, color: "#ccc", paddingLeft: 8 },
  situation: { fontSize: 15, color: "#333", marginTop: 6 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsBtnText: { fontSize: 22 },
  addBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4A90D9",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  addBtnText: { fontSize: 28, color: "#fff", lineHeight: 30 },
});
