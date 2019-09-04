// @flow

import type { EntityID, LoadObject, ParticleAttributes } from 'brewskey.js-api';

import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { CloudDeviceStore } from '../stores/DAOStores';
import OverviewItem from '../common/OverviewItem2';
import LoaderComponent from '../common/LoaderComponent';
import DeviceOnlineIndicator from './DeviceOnlineIndicator';

type Props = {|
  particleID: EntityID,
|};

@observer
class DeviceOnlineOverviewItem extends React.Component<Props> {
  @computed
  get _onlineStatusLoader(): LoadObject<boolean> {
    return CloudDeviceStore.getOne(this.props.particleID).map(
      ({ connected }: ParticleAttributes): boolean => !!connected,
    );
  }

  render() {
    return (
      <LoaderComponent
        particleID={this.props.particleID}
        errorComponent={ErrorComponent}
        loadedComponent={LoadedComponent}
        loader={this._onlineStatusLoader}
        loadingComponent={LoadingComponent}
      />
    );
  }
}

type LoadingComponentProps = {
  particleID: EntityID,
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
  particleID: EntityID,
  error: Error,
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
  particleID: EntityID,
  value: boolean,
};

const LoadedComponent = ({
  particleID,
  value: connected,
}: LoadedComponentProps) => (
  <OverviewItem
    particleID={particleID}
    description={
      !connected && 'Check that your device is powerd on and connected to WiFi'
    }
    rightComponent={DeviceOnlineIndicator}
    title="Online Status"
    value={connected ? 'Connected' : 'Disconnected'}
  />
);

export default DeviceOnlineOverviewItem;
