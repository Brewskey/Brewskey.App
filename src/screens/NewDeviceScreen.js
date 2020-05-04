// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { NavigationActions, StackActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import Header from '../common/Header';
import DeviceForm from '../components/DeviceForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {|
  hideLocation?: boolean,
  initialValues?: Device,
  navigation: Navigation,
  onDeviceCreated?: (device: Device) => void | Promise<any>,
  showBackButton?: boolean,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class NewDeviceScreen extends InjectedComponent<InjectedProps> {
  static defaultProps = {
    showBackButton: true,
  };

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const { navigation, onDeviceCreated } = this.injectedProps;
    const clientID = DAOApi.DeviceDAO.post(values);
    const device = await DAOApi.DeviceDAO.waitForLoaded((dao) =>
      dao.fetchByID(clientID),
    );
    SnackBarStore.showMessage({ text: 'New Brewskey box created' });

    if (onDeviceCreated) {
      onDeviceCreated(device);
      return;
    }

    const resetRouteAction = StackActions.reset({
      actions: [
        NavigationActions.navigate({ routeName: 'devices' }),
        NavigationActions.navigate({
          params: { id: device.id },
          routeName: 'deviceDetails',
        }),
      ],
      index: 1,
    });
    navigation.dispatch(resetRouteAction);
  };

  render(): React.Node {
    const { hideLocation, initialValues, showBackButton } = this.injectedProps;

    return (
      <Container>
        <Header showBackButton={showBackButton} title="New Brewskey box" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <DeviceForm
            device={initialValues ?? {}}
            hideLocation={hideLocation}
            onSubmit={this._onFormSubmit}
            submitButtonLabel="Create Device"
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default NewDeviceScreen;
