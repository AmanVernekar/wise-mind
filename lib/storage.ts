import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_KEY = "@wise_mind_entries";
const SETTINGS_KEY = "@wise_mind_settings";

export interface Entry {
  id: string;
  createdAt: string;
  situation: string;
  emotionalThoughts: string;
  rationalThoughts: string;
  wiseMind: string;
}

export interface Settings {
  notificationTime1: { hour: number; minute: number };
  notificationTime2: { hour: number; minute: number };
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  notificationTime1: { hour: 13, minute: 0 },
  notificationTime2: { hour: 20, minute: 0 },
  notificationsEnabled: true,
};

export async function getEntries(): Promise<Entry[]> {
  const json = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!json) return [];
  return JSON.parse(json);
}

export async function saveEntry(entry: Entry): Promise<void> {
  const entries = await getEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.unshift(entry);
  }
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  await AsyncStorage.setItem(
    ENTRIES_KEY,
    JSON.stringify(entries.filter((e) => e.id !== id))
  );
}

export async function getSettings(): Promise<Settings> {
  const json = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!json) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
