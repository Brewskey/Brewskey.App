import type { Tap } from '@brewskey/js-api';
import type { LeaderboardDurationValue } from '../components/LeaderboardDurationPicker';

import * as React from 'react';
import { View } from 'react-native';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import LeaderboardList from '../components/LeaderboardList';
import LeaderboardDurationPicker, {
  LEADERBOARD_DURATION_OPTIONS,
} from '../components/LeaderboardDurationPicker';

type InjectedProps = {
  noFlowSensorWarning: React.ReactNode | null | undefined;
  tap: Tap;
};

export const TapDetailsLeaderboardScreen: React.FC<InjectedProps> =
  withErrorBoundary(
    ({ noFlowSensorWarning, tap }: InjectedProps) => {
      const [leaderboardDuration, setLeaderboardDuration] =
        React.useState<LeaderboardDurationValue>(
          LEADERBOARD_DURATION_OPTIONS.TWELVE_HOURS.value,
        );

      const _onChangeLeaderboardDuration = (
        duration: LeaderboardDurationValue,
      ) => {
        setLeaderboardDuration(duration);
      };

      return (
        <LeaderboardList
          duration={leaderboardDuration}
          ListHeaderComponent={
            <View>
              {noFlowSensorWarning}
              <LeaderboardDurationPicker
                onChange={_onChangeLeaderboardDuration}
                value={leaderboardDuration}
              />
            </View>
          }
          tapID={tap.id}
        />
      );
    },
    <ErrorScreen shouldShowBackButton />,
  );
