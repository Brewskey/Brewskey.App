import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';

import OverviewItem from '../common/OverviewItem2';
import DeviceOnlineIndicator from './DeviceOnlineIndicator';
import { useGetParticleAttributes } from '../hooks/queries/CloudDeviceQueries';

type Props = {
  particleID: EntityID;
};

const DeviceOnlineOverviewItem: React.FC<Props> = ({ particleID }) => {
  const { data: cloudDevice, isLoading, error } = useGetParticleAttributes(particleID);

  if (isLoading) {
    return (
      <OverviewItem
        leftComponent={undefined}
        particleID={particleID}
        rightComponent={DeviceOnlineIndicator}
        title="Online Status"
        value="Loading..."
      />
    );
  }

  if (error) {
    return (
      <OverviewItem
        description="Oops! There was an error on checking online status."
        leftComponent={undefined}
        particleID={particleID}
        rightComponent={DeviceOnlineIndicator}
        title="Online Status"
        value="Error!"
      />
    );
  }

  const connected = cloudDevice?.connected ?? false;

  return (
    <OverviewItem
      description={
        !connected ? 'Check that your device is powerd on and connected to WiFi' : undefined
      }
      leftComponent={undefined}
      particleID={particleID}
      rightComponent={DeviceOnlineIndicator}
      testID="overview-item-online-status"
      title="Online Status"
      value={connected ? 'Connected' : 'Disconnected'}
    />
  );
};

type LoadingComponentProps = {
  particleID: EntityID;
};

const LoadingComponent = ({ particleID }: LoadingComponentProps) => (
  <OverviewItem
    particleID={particleID}
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value="Loading..."
  />
);

type ErrorComponentProps = {
  particleID: EntityID;
  error: Error;
};

const ErrorComponent = ({ particleID }: ErrorComponentProps) => (
  <OverviewItem
    description="Oops! There was an error on checking online status."
    particleID={particleID}
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value="Error!"
  />
);

type LoadedComponentProps = {
  particleID: EntityID;
  value: boolean;
};

const LoadedComponent = ({
  particleID,
  value: connected,
}: LoadedComponentProps) => (
  <OverviewItem
    particleID={particleID}
    description={
      !connected ? 'Check that your device is powerd on and connected to WiFi' : undefined
    }
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value={connected ? 'Connected' : 'Disconnected'}
  />
);

export default DeviceOnlineOverviewItem;
