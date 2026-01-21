import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="my-profile" />
      {/* my-friends is a directory, so don't declare it explicitly - Expo Router handles it automatically */}
      <Stack.Screen name="write-nfc" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="help" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
