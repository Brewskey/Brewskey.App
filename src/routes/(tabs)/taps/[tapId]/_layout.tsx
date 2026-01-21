import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLocalSearchParams, useRouter, useSegments, usePathname } from 'expo-router';
import { Slot } from 'expo-router';

import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import Container from '../../../../common/Container';
import Header from '../../../../common/Header';
import { HeaderNavigationButton } from '../../../../common/Header/HeaderNavigationButton';
import LoadingIndicator from '../../../../common/LoadingIndicator';
import { checkCanEdit } from '../../../../permissionHelpers';
import { useGetTapById } from '../../../../hooks/queries/TapQueries';
import { useGetPermissionForEntityById } from '../../../../hooks/queries/PermissionQueries';
import ErrorScreen from '../../../../common/ErrorScreen';
import theme from '../../../../theme';
import OnTapRoute from './on_tap';
import StatsRoute from './stats';
import LeaderboardRoute from './leaderboard';

const TapDetailsTab = createMaterialTopTabNavigator();

const TapDetailsLayout = withErrorBoundary(() => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const segments = useSegments();
  const pathname = usePathname();
  const { data: tap, isLoading } = useGetTapById(tapId as EntityID);
  const { data: tapPermission } = useGetPermissionForEntityById('tap', tapId as EntityID);

  // Check if we're on a nested route that should use file-based routing (keg, edit, etc.)
  // segments format: ['(tabs)', 'taps', '[tapId]', 'keg', 'new'] or ['(tabs)', 'taps', '[tapId]', 'on_tap']
  // For routes like /taps/[tapId]/keg/new, segments[3] would be 'keg'
  // For routes like /taps/[tapId]/on_tap, segments[3] would be 'on_tap'
  const segmentsArray = Array.isArray(segments) ? segments : [];
  
  // Also check pathname as a fallback - pathname format: /(tabs)/taps/123/keg/new
  const pathnameSegments = pathname?.split('/').filter(Boolean) || [];
  const pathnameHasKeg = pathnameSegments.includes('keg');
  const pathnameHasEdit = pathnameSegments.includes('edit');
  
  // Debug: log segments and pathname to understand routing
  React.useEffect(() => {
    console.log('[TapDetailsLayout] pathname:', pathname);
    console.log('[TapDetailsLayout] segments:', JSON.stringify(segmentsArray), 'length:', segmentsArray.length);
    console.log('[TapDetailsLayout] pathnameSegments:', JSON.stringify(pathnameSegments));
    if (segmentsArray.length >= 4) {
      console.log('[TapDetailsLayout] segments[3]:', segmentsArray[3], 'segments[4]:', segmentsArray[4]);
    }
  }, [pathname, segmentsArray, pathnameSegments]);

  const currentSegment = segmentsArray.length >= 4 ? (segmentsArray[3] as string | undefined) : null;
  const nextSegment = segmentsArray.length >= 5 ? (segmentsArray[4] as string | undefined) : null;
  
  // Check if we're on a nested route (keg, edit) - these should use Slot
  // Priority: pathname check is more reliable than segments for initial render
  // pathname format: /(tabs)/taps/123/keg/new or /(tabs)/taps/123/edit/feed
  const isNestedRoute = pathnameHasKeg || pathnameHasEdit;
  const isTabRoute = currentSegment && ['on_tap', 'stats', 'leaderboard'].includes(currentSegment);
  
  // If it's a nested route (keg/new, edit/feed, etc.), use Slot for file-based routing
  // This allows expo-router to handle the nested routes through their own _layout.tsx files
  // Early return before loading tap data to avoid unnecessary queries
  if (isNestedRoute && !isTabRoute) {
    console.log('[TapDetailsLayout] Using Slot for nested route. pathname:', pathname);
    return <Slot />;
  }

  if (isLoading) {
    return (
      <Container>
        <Header showBackButton title="Tap" />
        <LoadingIndicator />
      </Container>
    );
  }

  if (!tap) {
    return null;
  }

  return (
    <Container>
      <Header
        rightComponent={
          !checkCanEdit(tapPermission) ? null : (
            <HeaderNavigationButton
              name="edit"
              href={`/(tabs)/taps/${tapId}/edit`}
              testID="button-edit-tap"
            />
          )
        }
        showBackButton
        title="Tap"
        testID="header-tap-details"
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
        {tap!.hideStats ? null : (
          <TapDetailsTab.Screen name="stats" options={{ title: 'Stats' }}>
            {() => <StatsRoute />}
          </TapDetailsTab.Screen>
        )}
        {tap!.hideLeaderboard ? null : (
          <TapDetailsTab.Screen name="leaderboard" options={{ title: 'Leaderboard' }}>
            {() => <LeaderboardRoute />}
          </TapDetailsTab.Screen>
        )}
      </TapDetailsTab.Navigator>
    </Container>
  );
}, ErrorScreen);

export default TapDetailsLayout;
