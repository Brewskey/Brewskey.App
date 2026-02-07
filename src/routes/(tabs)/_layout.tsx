import { Tabs } from 'expo-router';

import { CustomTabBar } from 'components/MainTabBar/CustomTabBar';
import {
  NotificationRegistrationProvider,
  useNotificationHandlers,
} from 'hooks/useNotificationHandlers';

export default function TabsLayout() {
  const { requestPermissionAndRegister } = useNotificationHandlers();

  return (
    <NotificationRegistrationProvider
      requestPermissionAndRegister={requestPermissionAndRegister}
    >
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
    </NotificationRegistrationProvider>
  );
}
