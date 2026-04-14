import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Entry, getEntries, saveEntry } from "../lib/storage";

const PROMPTS = {
  situation: "Briefly describe the situation...",
  emotionalThoughts:
    "What went through my mind? What disturbed me? What am I reacting to? What's the worst that could happen? What do I want to do? What am I feeling?",
  rationalThoughts:
    "What would be more reasonable? What advice would I give a friend? Is this really as important as it seems? What are the facts?",
  wiseMind:
    "STOPP! Take a breath. What's the bigger picture? What will the consequences be? What's the best response — for me, for others, for the situation?",
};

export default function NewEntry() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [situation, setSituation] = useState("");
  const [emotionalThoughts, setEmotionalThoughts] = useState("");
  const [rationalThoughts, setRationalThoughts] = useState("");
  const [wiseMind, setWiseMind] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getEntries().then((entries) => {
        const entry = entries.find((e) => e.id === id);
        if (entry) {
          setSituation(entry.situation);
          setEmotionalThoughts(entry.emotionalThoughts);
          setRationalThoughts(entry.rationalThoughts);
          setWiseMind(entry.wiseMind);
          setExistingId(entry.id);
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    const entry: Entry = {
      id: existingId || Date.now().toString(),
      createdAt: existingId
        ? new Date().toISOString() // keep original? no, update is fine
        : new Date().toISOString(),
      situation,
      emotionalThoughts,
      rationalThoughts,
      wiseMind,
    };
    await saveEntry(entry);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Situation</Text>
        <TextInput
          style={styles.input}
          placeholder={PROMPTS.situation}
          placeholderTextColor="#999"
          multiline
          value={situation}
          onChangeText={setSituation}
        />

        <Text style={styles.label}>Emotional Thoughts</Text>
        <Text style={styles.hint}>What does Emotion Mind say?</Text>
        <TextInput
          style={[styles.input, styles.inputLarge]}
          placeholder={PROMPTS.emotionalThoughts}
          placeholderTextColor="#999"
          multiline
          value={emotionalThoughts}
          onChangeText={setEmotionalThoughts}
        />

        <Text style={styles.label}>Rational Thoughts</Text>
        <Text style={styles.hint}>What does Reasonable Mind say?</Text>
        <TextInput
          style={[styles.input, styles.inputLarge]}
          placeholder={PROMPTS.rationalThoughts}
          placeholderTextColor="#999"
          multiline
          value={rationalThoughts}
          onChangeText={setRationalThoughts}
        />

        <Text style={styles.label}>Wise Mind</Text>
        <Text style={styles.hint}>
          Where Emotion and Reason meet — what's the balanced response?
        </Text>
        <TextInput
          style={[styles.input, styles.inputLarge]}
          placeholder={PROMPTS.wiseMind}
          placeholderTextColor="#999"
          multiline
          value={wiseMind}
          onChangeText={setWiseMind}
        />

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: "700", color: "#333", marginTop: 16 },
  hint: { fontSize: 13, color: "#4A90D9", marginTop: 2, marginBottom: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#333",
    marginTop: 6,
    minHeight: 60,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputLarge: { minHeight: 100 },
  saveBtn: {
    backgroundColor: "#4A90D9",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
