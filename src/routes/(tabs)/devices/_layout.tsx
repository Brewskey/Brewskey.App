import { Stack } from 'expo-router';

export default function DevicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/edit" />
      <Stack.Screen name="[id]/wifi-setup" />
      <Stack.Screen name="new" />
    </Stack>
  );
}
