import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { SectionHeader } from 'common/SectionHeader';
import { WarningNotification } from 'common/WarningNotification';
import { SectionPoursList } from 'components/poursLists/SectionPoursList';
import { useGetFlowSensorByTapId } from 'hooks/queries/FlowSensorQueries';
import { useGetPermissionForEntityById } from 'hooks/queries/PermissionQueries';
import { useGetTapById } from 'hooks/queries/TapQueries';
import { checkCanEdit, checkIsAdmin } from 'permissionHelpers';

const StatsRoute: React.FC = () => {
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
        <LoadingIndicator />
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

  return (
    <Container>
      <SectionPoursList
        canDeletePours={checkIsAdmin(tapPermission)}
        ListHeaderComponent={
          <View>
            {noFlowSensorWarning}
            <SectionHeader
              testID="section-header-recent-pours"
              title="Recent pours"
            />
          </View>
        }
        queryOptions={{
          filters: [createFilter('tap/id').equals(tap.id)],
        }}
      />
    </Container>
  );
};

export default withErrorBoundary(
  StatsRoute,
  <ErrorScreen shouldShowBackButton />,
);
