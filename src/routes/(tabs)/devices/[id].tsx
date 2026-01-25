import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { createFilter } from '@brewskey/js-api/dist/filters';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import TapsList from '../../../components/TapsList';
import OverviewItem from '../../../common/OverviewItem2';
import DeviceStateOverviewItem from '../../../components/DeviceStateOverviewItem';
import DeviceOnlineOverviewItem from '../../../components/DeviceOnlineOverviewItem';
import Container from '../../../common/Container';
import Section from '../../../common/Section';
import SectionHeader from '../../../common/SectionHeader';
import LoadingIndicator from '../../../common/LoadingIndicator';
import Header from '../../../common/Header';
import NotFoundScreen from '../../../common/NotFoundScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import { useGetDeviceById } from '../../../hooks/queries/DeviceQueries';

const DeviceDetailsScreen = withErrorBoundary(() => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    // Normalize ID: expo-router may serialize numbers as strings
    const normalizedDeviceId: EntityID =
      typeof id === 'string' && !isNaN(Number(id))
        ? Number(id)
        : (id as EntityID);

    const { data: device, isLoading, refetch } = useGetDeviceById(normalizedDeviceId);

    if (!normalizedDeviceId) {
      return (
        <NotFoundScreen
          title="Device Not Found"
          message="The device you're looking for could not be found."
        />
      );
    }

    const onAddTapPress = () => {
      if (device) {
        router.navigate({
          pathname: '/(tabs)/taps/new',
          params: { deviceId: device.id.toString() },
        });
      }
    };

    if (isLoading) {
      return (
        <Container>
          <Header shouldShowBackButton />
          <LoadingIndicator />
        </Container>
      );
    }

    if (!device) {
      return (
        <NotFoundScreen
          title="Device Not Found"
          message="The device you're looking for could not be found."
        />
      );
    }

    return (
      <Container>
        <Header
          rightComponent={
          <HeaderNavigationButton
            name="edit"
            href={{ pathname: '/(tabs)/devices/[id]/edit', params: { id: device.id.toString() } }}
          />
          }
          shouldShowBackButton
          title={device.name}
        />
        <TapsList
          ListHeaderComponent={
            <Container>
              <Section bottomPadded>
                <OverviewItem title="Box ID" value={device.particleId} testID="overview-item-box-id" />
                <DeviceStateOverviewItem deviceState={device.deviceStatus} />
                <DeviceOnlineOverviewItem particleID={device.particleId} />
              </Section>
              <SectionHeader title="Taps" testID="section-header-taps" />
            </Container>
          }
          onAddTapPress={onAddTapPress}
          onRefresh={refetch}
          queryOptions={{
            filters: [createFilter('device/id').equals(normalizedDeviceId)],
          }}
        />
      </Container>
    );
  },
  <ErrorScreen shouldShowBackButton />,
);

export default DeviceDetailsScreen;
