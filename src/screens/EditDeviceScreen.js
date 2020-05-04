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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { DeviceStore } from '../stores/DAOStores';
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
    const id = nullthrows(values.id);
    DAOApi.DeviceDAO.put(id, values);
    await DAOApi.DeviceDAO.waitForLoaded((dao) => dao.fetchByID(id));

    this.injectedProps.navigation.goBack(null);
    SnackBarStore.showMessage({ text: 'The Brewskey box was edited' });
  };

  render(): React.Node {
    return (
      <Container>
        <Header showBackButton title="Edit Brewskey box" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <LoaderComponent
            loadedComponent={LoadedComponent}
            loader={this._deviceLoader}
            onFormSubmit={this._onFormSubmit}
            updatingComponent={LoadedComponent}
          />
        </KeyboardAwareScrollView>
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
