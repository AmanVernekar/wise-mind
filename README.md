# Wise Mind

A simple Android journaling app based on the DBT [Wise Mind worksheet](https://www.getselfhelp.co.uk/wisemind.htm) (Linehan 1993). Sends you two daily reminders to reflect on your day through three lenses: Emotional Thoughts, Rational Thoughts, and Wise Mind.

## Features

- **4-section journal entries**: Situation, Emotional Thoughts, Rational Thoughts, Wise Mind — each with guiding prompts
- **Daily notifications**: Two configurable reminders (default 1:00 PM & 8:00 PM)
- **Fully local**: All data stored on-device via AsyncStorage — no accounts, no backend
- **Browse & edit**: View past entries, tap to edit, swipe to delete

## Tech Stack

- [Expo](https://expo.dev) (React Native) with expo-router
- expo-notifications for local scheduled notifications
- AsyncStorage for persistence

## Setup

```bash
npm install
npx expo start
```

## Build APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Download the APK from the EAS build link and install on your Android device.

> **Note:** Notifications require the actual APK build — they don't work in Expo Go.
