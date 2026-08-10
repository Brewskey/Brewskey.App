import * as React from 'react';

import { OverviewItem2 } from 'common/OverviewItem2';
import { DeviceOnlineIndicator } from 'components/DeviceOnlineIndicator';
import { useGetParticleAttributes } from 'hooks/queries/CloudDeviceQueries';

import type { EntityID } from '@brewskey/js-api';

interface Props {
  particleID: EntityID;
}

const DeviceOnlineOverviewItem: React.FC<Props> = ({ particleID }) => {
  const {
    data: cloudDevice,
    isLoading,
    error,
  } = useGetParticleAttributes(particleID);

  if (isLoading) {
    return (
      <OverviewItem2
        leftComponent={undefined}
        particleID={particleID}
        rightComponent={DeviceOnlineIndicator}
        testID="overview-item-online-status"
        title="Online Status"
        value="Loading..."
      />
    );
  }

  if (error) {
    return (
      <OverviewItem2
        description="Oops! There was an error on checking online status."
        leftComponent={undefined}
        particleID={particleID}
        rightComponent={DeviceOnlineIndicator}
        testID="overview-item-online-status"
        title="Online Status"
        value="Error!"
      />
    );
  }

  const connected = cloudDevice?.connected ?? false;

  return (
    <OverviewItem2
      leftComponent={undefined}
      particleID={particleID}
      rightComponent={DeviceOnlineIndicator}
      testID="overview-item-online-status"
      title="Online Status"
      value={connected ? 'Connected' : 'Disconnected'}
      description={
        !connected
          ? 'Check that your device is powerd on and connected to WiFi'
          : undefined
      }
    />
  );
};

export { DeviceOnlineOverviewItem };
