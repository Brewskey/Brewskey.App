import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import WarningNotification from '../common/WarningNotification';
import LoadingIndicator from '../common/LoadingIndicator';
import TapDetailsKegScreen from './TapDetailsKegScreen';
import TapDetailsStatsScreen from './TapDetailsStatsScreen';
import { checkCanEdit } from '../permissionHelpers';
import { useGetTapById } from '../hooks/queries/TapQueries';
import { useGetPermissionForEntityById } from '../hooks/queries/PermissionQueries';
import { useGetFlowSensorByTapId } from '../hooks/queries/FlowSensorQueries';
import { StaticScreenProps, useNavigation, NavigationProp } from '@react-navigation/native';
import ErrorScreen from '../common/ErrorScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import theme from '../theme';
import { TapDetailsLeaderboardScreen } from './TapDetailsLeaderboardScreen';
import { HomeStackParamList } from '../AppRouter';

const TapDetailsTab = createMaterialTopTabNavigator();

type Props = StaticScreenProps<{
  tapId: EntityID;
}>;

export const TapDetailsScreen: React.FC<Props> =
  ({
    route: {
      params: { tapId },
    },
  }: Props) => {
    const {data: tap, isLoading, status} = useGetTapById(tapId);
    const { data: tapPermission } = useGetPermissionForEntityById('tap', tapId);
    const { data: flowSensor } = useGetFlowSensorByTapId(tapId);
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

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

    const onWarningPress = () => {
      navigation.navigate('newFlowSensor', {
        shouldReturnOnFinish: true,
        showBackButton: true,
        tapId: tap!.id,
      });
    };

    const noFlowSensorWarning: React.ReactNode =
      !flowSensor && checkCanEdit(tapPermission) ? (
        <WarningNotification
          message="You haven't setup flow sensor on the tap. Click to setup."
          onPress={onWarningPress}
        />
      ) : null;

    const screenProps = {
      noFlowSensorWarning,
      tap: tap!,
      tapPermission,
    };

    return (
      <Container>
        <Header
          rightComponent={
            !checkCanEdit(tapPermission) ? null : (
              <HeaderNavigationButton
                name="edit"
                screen="LoggedInStack"
                params={{
                  screen: 'home',
                  params: {
                    screen: 'editTap',
                    params: { tapId: tapId },
                  },
                }}
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
            {() => <TapDetailsKegScreen {...screenProps} />}
          </TapDetailsTab.Screen>
          {tap!.hideStats ? null : (
            <TapDetailsTab.Screen name="stats" options={{ title: 'Stats' }}>
              {() => <TapDetailsStatsScreen {...screenProps} />}
            </TapDetailsTab.Screen>
          )}
          {tap!.hideLeaderboard ? null : (
            <TapDetailsTab.Screen name="leaderboard" options={{ title: 'Leaderboard' }}>
              {() => <TapDetailsLeaderboardScreen {...screenProps} />}
            </TapDetailsTab.Screen>
          )}
        </TapDetailsTab.Navigator>
      </Container>
    );
  }
