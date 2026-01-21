import { Stack } from 'expo-router';

export default function NuxLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="location" />
      <Stack.Screen name="wifi" />
      <Stack.Screen name="device" />
      <Stack.Screen name="tap" />
      <Stack.Screen name="finish" />
    </Stack>
  );
}
