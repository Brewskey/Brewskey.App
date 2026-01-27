import { Stack } from 'expo-router';

export const TapsLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    {/* [tapId] is a directory, so don't declare it explicitly - Expo Router handles it automatically */}
    {/* All nested routes under [tapId] are handled by the [tapId]/_layout.tsx */}
    <Stack.Screen name="new" />
  </Stack>
);
