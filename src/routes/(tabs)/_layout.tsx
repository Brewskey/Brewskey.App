import { Tabs } from 'expo-router';

import { CustomTabBar } from '../../components/MainTabBar/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: () => null, // Handled by CustomTabBar
        }}
      />
      {/* Hidden routes - accessible via navigation but not shown in tab bar */}
      <Tabs.Screen
        name="locations"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="taps"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="beverages"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="flow-sensor"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="(nux)"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
