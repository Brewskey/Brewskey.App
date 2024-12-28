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
import TapDetailsLeaderboardScreen from './TapDetailsLeaderboardScreen';
import { checkCanEdit } from '../permissionHelpers';
import { useGetTapById } from '../hooks/queries/TapQueries';
import { useGetPermissionForEntityById } from '../hooks/queries/PermissionQueries';
import { useGetFlowSensorByTapId } from '../hooks/queries/FlowSensorQueries';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import ErrorScreen from '../common/ErrorScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const tabScreens = {
  tapDetailsKeg: { screen: TapDetailsKegScreen },
  tapDetailsStats: {
    getShouldShowTab: ({ tap }) => !tap.hideStats,
    screen: TapDetailsStatsScreen,
  },
  tapDetailsLeaderboard: {
    getShouldShowTab: ({ tap }) => !tap.hideLeaderboard,
    screen: TapDetailsLeaderboardScreen,
  },
} as const;

const TapDetailsTab = createMaterialTopTabNavigator();

type Props = StaticScreenProps<{
  tapId: EntityID;
}>;

export const TapDetailsScreen: React.FC<Props> = withErrorBoundary(
  ({
    route: {
      params: { tapId },
    },
  }: Props) => {
    const tap = useGetTapById(tapId);
    const { data: tapPermission } = useGetPermissionForEntityById(
      'taps',
      tapId,
    );
    const { data: flowSensor } = useGetFlowSensorByTapId(tapId);
    const navigation = useNavigation();

    if (tap.isLoading) {
      return (
        <Container>
          <Header showBackButton title="Tap" />
          <LoadingIndicator />
        </Container>
      );
    }
    if (tap.status !== 'success') {
      return null;
    }

    const onWarningPress = () => {
      navigation.navigate('newFlowSensor', {
        returnOnFinish: true,
        showBackButton: true,
        tapId: tap.data!.id,
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
      tap: tap.data,
      tapPermission,
    };

    return (
      <Container>
        <Header
          rightComponent={
            !checkCanEdit(tapPermission) ? null : (
              <HeaderNavigationButton
                name="edit"
                params={{ id: tapId }}
                toRoute="editTap"
                onPress={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            )
          }
          showBackButton
          title="Tap"
        />
        <TapDetailsTab.Navigator>
          <TapDetailsTab.Screen name="tapDetailsKeg">
            {({ navigator }) => (
              <TapDetailsKegScreen {...screenProps} navigator={navigator} />
            )}
          </TapDetailsTab.Screen>
        </TapDetailsTab.Navigator>
      </Container>
    );
  },
  <ErrorScreen showBackButton />,
);
