import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import LoadingIndicator from '../../../common/LoadingIndicator';
import NotFoundScreen from '../../../common/NotFoundScreen';
import OverviewItem from '../../../common/OverviewItem2';
import DeviceOnlineOverviewItem from '../../../components/DeviceOnlineOverviewItem';
import Section from '../../../common/Section';
import SectionHeader from '../../../common/SectionHeader';
import DeviceStateOverviewItem from '../../../components/DeviceStateOverviewItem';
import TapsList from '../../../components/TapsList';
import { useGetDeviceById } from '../../../hooks/queries/DeviceQueries';

import type { EntityID } from '@brewskey/js-api';

const DeviceDetailsScreen = withErrorBoundary(
  () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    // Normalize ID: expo-router may serialize numbers as strings
    const normalizedDeviceId: EntityID =
      typeof id === 'string' && !isNaN(Number(id))
        ? Number(id)
        : (id as EntityID);

    const {
      data: device,
      isLoading,
      refetch,
    } = useGetDeviceById(normalizedDeviceId);

    if (!normalizedDeviceId) {
      return (
        <NotFoundScreen
          message="The device you're looking for could not be found."
          title="Device Not Found"
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
          message="The device you're looking for could not be found."
          title="Device Not Found"
        />
      );
    }

    return (
      <Container>
        <Header
          shouldShowBackButton
          title={device.name}
          rightComponent={
            <HeaderNavigationButton
              name="edit"
              href={{
                pathname: '/(tabs)/devices/[id]/edit',
                params: { id: device.id.toString() },
              }}
            />
          }
        />
        <TapsList
          onAddTapPress={onAddTapPress}
          onRefresh={refetch}
          ListHeaderComponent={
            <Container>
              <Section bottomPadded>
                <OverviewItem
                  testID="overview-item-box-id"
                  title="Box ID"
                  value={device.particleId}
                />
                <DeviceStateOverviewItem deviceState={device.deviceStatus} />
                <DeviceOnlineOverviewItem particleID={device.particleId} />
              </Section>
              <SectionHeader testID="section-header-taps" title="Taps" />
            </Container>
          }
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
