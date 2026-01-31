import { Tabs } from 'expo-router';

import { CustomTabBar } from 'components/MainTabBar/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(feed)"
        options={{
          title: 'Home',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="(stats)"
        options={{
          title: 'Stats',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="(notifications)"
        options={{
          title: 'Notifications',
          headerShown: false,
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="(menu)"
        options={{
          title: 'Menu',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="(nux)"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
