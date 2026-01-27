import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Container } from '../../../../../common/Container';
import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../../../common/ErrorScreen';
import { Header } from '../../../../../common/Header';
import { LoadingIndicator } from '../../../../../common/LoadingIndicator';
import { NotFoundScreen } from '../../../../../common/NotFoundScreen';
import { WarningNotification } from '../../../../../common/WarningNotification';
import {
  LEADERBOARD_DURATION_OPTIONS,
  LeaderBoardDurationPicker,
} from '../../../../../components/LeaderboardDurationPicker';
import { LeaderboardList } from '../../../../../components/LeaderboardList';
import { useGetFlowSensorByTapId } from '../../../../../hooks/queries/FlowSensorQueries';
import { useGetPermissionForEntityById } from '../../../../../hooks/queries/PermissionQueries';
import { useGetTapById } from '../../../../../hooks/queries/TapQueries';
import { checkCanEdit } from '../../../../../permissionHelpers';

import type { LeaderboardDurationValue } from '../../../../../components/LeaderboardDurationPicker';

const LeaderboardRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const id =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
  const router = useRouter();

  const { data: tap, isLoading } = useGetTapById(id as any);
  const { data: tapPermission } = useGetPermissionForEntityById(
    'tap',
    id as any,
  );
  const { data: flowSensor } = useGetFlowSensorByTapId(id as any);

  const [leaderboardDuration, setLeaderboardDuration] =
    React.useState<LeaderboardDurationValue>(
      LEADERBOARD_DURATION_OPTIONS.TWELVE_HOURS.value,
    );

  if (!id) {
    return (
      <NotFoundScreen
        message="The tap you're looking for could not be found."
        title="Tap Not Found"
      />
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Header shouldShowBackButton />
        <LoadingIndicator testID="leaderboard-loading" />
      </Container>
    );
  }

  if (!tap) {
    return (
      <NotFoundScreen
        message="The tap you're looking for could not be found."
        title="Tap Not Found"
      />
    );
  }

  const onWarningPress = () => {
    router.navigate({
      pathname: '/(tabs)/flow-sensor/new',
      params: {
        tapId: tap.id.toString(),
        shouldReturnOnFinish: 'true',
        showBackButton: 'true',
      },
    });
  };

  const noFlowSensorWarning: React.ReactNode | null | undefined =
    !flowSensor && checkCanEdit(tapPermission) ? (
      <WarningNotification
        message="You haven't setup flow sensor on the tap. Click to setup."
        onPress={onWarningPress}
      />
    ) : null;

  const _onChangeLeaderboardDuration = (duration: LeaderboardDurationValue) => {
    setLeaderboardDuration(duration);
  };

  return (
    <LeaderboardList
      duration={leaderboardDuration}
      tapID={tap.id}
      ListHeaderComponent={
        <View>
          {noFlowSensorWarning}
          <LeaderBoardDurationPicker
            onChange={_onChangeLeaderboardDuration}
            value={leaderboardDuration}
          />
        </View>
      }
    />
  );
};

export default withErrorBoundary(
  LeaderboardRoute,
  <ErrorScreen shouldShowBackButton />,
);
