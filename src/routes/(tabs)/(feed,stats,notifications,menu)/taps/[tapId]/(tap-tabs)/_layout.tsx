import * as React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLocalSearchParams } from 'expo-router';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { ScreenFallback } from 'common/ScreenFallback';
import { useGetPermissionForEntityById } from 'hooks/queries/PermissionQueries';
import { useGetTapById } from 'hooks/queries/TapQueries';
import { checkCanEdit } from 'permissionHelpers';
import { theme } from 'theme';

import LeaderboardRoute from './leaderboard';
import OnTapRoute from './on_tap';
import StatsRoute from './stats';

import type { EntityID } from '@brewskey/js-api';

const TapDetailsTab = createMaterialTopTabNavigator();

const TapTabsLayout = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const { data: tap, isLoading } = useGetTapById(tapId as EntityID);
  const { data: tapPermission } = useGetPermissionForEntityById(
    'tap',
    tapId as EntityID,
  );

  if (isLoading || !tap) {
    return (
      <ScreenFallback shouldShowBackButton testID="tap-tabs" title="Tap" />
    );
  }

  return (
    <Container>
      <Header
        showBackButton
        testID="header-tap-details"
        title="Tap"
        rightComponent={
          !checkCanEdit(tapPermission) ? null : (
            <HeaderNavigationButton
              name="edit"
              testID="button-edit-tap"
              href={{
                pathname: '/taps/[tapId]/edit',
                params: { tapId: String(tapId) },
              }}
            />
          )
        }
      />
      <TapDetailsTab.Navigator
        initialRouteName="on_tap"
        screenOptions={{
          lazy: true,
          swipeEnabled: false,
          ...theme.tabBar.tabBarOptions,
        }}
      >
        <TapDetailsTab.Screen name="on_tap" options={{ title: 'On Tap' }}>
          {() => <OnTapRoute />}
        </TapDetailsTab.Screen>
        {tap.hideStats ? null : (
          <TapDetailsTab.Screen name="stats" options={{ title: 'Stats' }}>
            {() => <StatsRoute />}
          </TapDetailsTab.Screen>
        )}
        {tap.hideLeaderboard ? null : (
          <TapDetailsTab.Screen
            name="leaderboard"
            options={{ title: 'Leaderboard' }}
          >
            {() => <LeaderboardRoute />}
          </TapDetailsTab.Screen>
        )}
      </TapDetailsTab.Navigator>
    </Container>
  );
};

export default TapTabsLayout;
