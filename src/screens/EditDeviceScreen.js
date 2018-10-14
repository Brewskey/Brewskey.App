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
import { observer } from 'mobx-react/native';
import { DeviceStore, waitForLoaded } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import nullthrows from 'nullthrows';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import DeviceForm from '../components/DeviceForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {
  id: EntityID,
  navigation: Navigation,
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class EditDeviceScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _deviceLoader(): LoadObject<Device> {
    return DeviceStore.getByID(this.injectedProps.id);
  }

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    DAOApi.DeviceDAO.put(nullthrows(values.id), values);
    await waitForLoaded(() => this._deviceLoader);
    this.injectedProps.navigation.goBack(null);
    SnackBarStore.showMessage({ text: 'The Brewskey box was edited' });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit Brewskey box" />
        <LoaderComponent
          loadedComponent={LoadedComponent}
          loader={this._deviceLoader}
          onFormSubmit={this._onFormSubmit}
          updatingComponent={LoadedComponent}
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
  <DeviceForm
    device={value}
    onSubmit={onFormSubmit}
    submitButtonLabel="Edit Device"
  />
);

export default EditDeviceScreen;
