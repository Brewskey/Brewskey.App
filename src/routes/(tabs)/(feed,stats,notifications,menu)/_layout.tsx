import { Stack } from 'expo-router';

export const unstable_settings = {
  feed: { initialRouteName: 'index' },
  stats: { initialRouteName: 'index' },
  notifications: { initialRouteName: 'index' },
  menu: { initialRouteName: 'index' },
};

export default function SharedSecondaryLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
