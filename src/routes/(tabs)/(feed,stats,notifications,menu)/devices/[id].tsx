import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { OverviewItem2 } from 'common/OverviewItem2';
import { ScreenFallback } from 'common/ScreenFallback';
import { Section } from 'common/Section';
import { SectionHeader } from 'common/SectionHeader';
import { DeviceOnlineOverviewItem } from 'components/DeviceOnlineOverviewItem';
import { DeviceStatusOverviewItem } from 'components/DeviceStateOverviewItem';
import { TapsList } from 'components/TapsList';
import { useSuspenseGetDeviceById } from 'hooks/queries/DeviceQueries';

import type { EntityID } from '@brewskey/js-api';

const DeviceDetailsContent: React.FC<{ deviceId: EntityID }> = ({
  deviceId,
}) => {
  const router = useRouter();
  const { data: device, refetch } = useSuspenseGetDeviceById(deviceId);

  const onAddTapPress = () => {
    router.navigate({
      pathname: '/taps/new',
      params: { deviceId: device.id.toString() },
    });
  };

  return (
    <Container>
      <Header
        shouldShowBackButton
        title={device.name}
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            href={{
              pathname: '/devices/[id]/edit',
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
              <OverviewItem2
                testID="overview-item-box-id"
                title="Box ID"
                value={device.particleId}
              />
              <DeviceStatusOverviewItem deviceState={device.deviceStatus} />
              <DeviceOnlineOverviewItem particleID={device.particleId} />
            </Section>
            <SectionHeader testID="section-header-taps" title="Taps" />
          </Container>
        }
        queryOptions={{
          filters: [createFilter('device/id').equals(deviceId)],
        }}
      />
    </Container>
  );
};

const DeviceDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const normalizedDeviceId: EntityID | undefined =
    typeof id === 'string' && !isNaN(Number(id))
      ? Number(id)
      : (id as EntityID | undefined);

  if (!normalizedDeviceId) {
    return (
      <NotFoundScreen
        message="The device you're looking for could not be found."
        title="Device Not Found"
      />
    );
  }

  return (
    <React.Suspense
      fallback={
        <ScreenFallback
          shouldShowBackButton
          testID="device-details"
          title={undefined}
        />
      }
    >
      <DeviceDetailsContent deviceId={normalizedDeviceId} />
    </React.Suspense>
  );
};

export default DeviceDetailsScreen;
