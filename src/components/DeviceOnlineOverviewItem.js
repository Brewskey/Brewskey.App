// @flow

import type { EntityID, LoadObject, ParticleAttributes } from 'brewskey.js-api';

import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { DeviceStore } from '../stores/DAOStores';
import OverviewItem from '../common/OverviewItem2';
import LoaderComponent from '../common/LoaderComponent';
import DeviceOnlineIndicator from './DeviceOnlineIndicator';

type Props = {|
  deviceID: EntityID,
|};

@observer
class DeviceOnlineOverviewItem extends React.Component<Props> {
  @computed
  get _onlineStatusLoader(): LoadObject<boolean> {
    return DeviceStore.getParticleAttributes(this.props.deviceID).map(
      ({ connected }: ParticleAttributes): boolean => connected,
    );
  }

  render() {
    return (
      <LoaderComponent
        deviceID={this.props.deviceID}
        errorComponent={ErrorComponent}
        loadedComponent={LoadedComponent}
        loader={this._onlineStatusLoader}
        loadingComponent={LoadingComponent}
      />
    );
  }
}

type LoadingComponentProps = {
  deviceID: EntityID,
};

const LoadingComponent = ({ deviceID }: LoadingComponentProps) => (
  <OverviewItem
    deviceID={deviceID}
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value="Loading..."
  />
);

type ErrorComponentProps = {
  deviceID: EntityID,
  error: Error,
};

const ErrorComponent = ({ deviceID }: ErrorComponentProps) => (
  <OverviewItem
    description="Ops! There was an error on checking online status."
    deviceID={deviceID}
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value="Error!"
  />
);

type LoadedComponentProps = {
  deviceID: EntityID,
  value: boolean,
};

const LoadedComponent = ({
  deviceID,
  value: connected,
}: LoadedComponentProps) => (
  <OverviewItem
    deviceID={deviceID}
    description={
      !connected && 'Check that your device is powerd on and connected to WiFi'
    }
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value={connected ? 'Connected' : 'Disconnected'}
  />
);

export default DeviceOnlineOverviewItem;
