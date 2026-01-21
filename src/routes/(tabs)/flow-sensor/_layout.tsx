import { Stack } from 'expo-router';

export default function FlowSensorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[tapId]/edit" />
      <Stack.Screen name="new" />
      <Stack.Screen name="custom" />
    </Stack>
  );
}
