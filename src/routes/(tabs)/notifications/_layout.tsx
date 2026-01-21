import { Stack } from 'expo-router';

export default function NotificationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* my-friends is a directory, so don't declare it explicitly - Expo Router handles it automatically */}
    </Stack>
  );
}
