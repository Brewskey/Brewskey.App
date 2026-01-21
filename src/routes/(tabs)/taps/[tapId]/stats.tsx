import type { Permission, Tap } from '@brewskey/js-api';

import * as React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createFilter } from '@brewskey/js-api/dist/filters';

import ErrorScreen from '../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import Container from '../../../../common/Container';
import Header from '../../../../common/Header';
import SectionHeader from '../../../../common/SectionHeader';
import LoadingIndicator from '../../../../common/LoadingIndicator';
import NotFoundScreen from '../../../../common/NotFoundScreen';
import { checkCanEdit, checkIsAdmin } from '../../../../permissionHelpers';
import { useGetTapById } from '../../../../hooks/queries/TapQueries';
import { useGetPermissionForEntityById } from '../../../../hooks/queries/PermissionQueries';
import { useGetFlowSensorByTapId } from '../../../../hooks/queries/FlowSensorQueries';
import WarningNotification from '../../../../common/WarningNotification';
import SectionPoursList from '../../../../components/poursLists/SectionPoursList';

const StatsRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const id = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
  const router = useRouter();
  
  const { data: tap, isLoading } = useGetTapById(id as any);
  const { data: tapPermission } = useGetPermissionForEntityById('tap', id as any);
  const { data: flowSensor } = useGetFlowSensorByTapId(id as any);

  if (!id) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
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
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  const onWarningPress = () => {
    router.navigate(`/(tabs)/flow-sensor/new?tapId=${tap.id}&shouldReturnOnFinish=true&showBackButton=true`);
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
            <SectionHeader title="Recent pours" testID="section-header-recent-pours" />
          </View>
        }
        queryOptions={{
          filters: [createFilter('tap/id').equals(tap.id)],
        }}
      />
    </Container>
  );
};

export default withErrorBoundary(StatsRoute, <ErrorScreen shouldShowBackButton />);
