// @flow

import type {
  Device,
  DeviceMutator,
  EntityID,
  LoadObject,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { DeviceStore } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import nullthrows from 'nullthrows';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditDeviceForm from '../components/EditDeviceForm';

type InjectedProps = {
  id: EntityID,
  navigation: Navigation,
};

@flatNavigationParamsAndScreenProps
@observer
class EditDeviceScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _deviceLoader(): LoadObject<Device> {
    return DeviceStore.getByID(this.injectedProps.id);
  }

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    DAOApi.DeviceDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit Brewskey box" />
        <LoaderComponent
          loadedComponent={LoadedComponent}
          loader={this._deviceLoader}
          onFormSubmit={this._onFormSubmit}
        />
      </Container>
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: DeviceMutator) => Promise<void>,
  value: Device,
};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => (
  <EditDeviceForm device={value} onSubmit={onFormSubmit} />
);

export default EditDeviceScreen;
