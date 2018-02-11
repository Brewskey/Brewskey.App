// @flow

import type { DeviceMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { NavigationActions } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { DeviceStore, waitForLoaded } from '../stores/DAOStores';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import Header from '../common/Header';
import DeviceForm from '../components/DeviceForm';

type InjectedProps = {|
  navigation: Navigation,
  particleID: string,
|};

@flatNavigationParamsAndScreenProps
@observer
class NewDeviceScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.DeviceDAO.post(values);
    const { id } = await waitForLoaded(() => DeviceStore.getByID(clientID));

    const resetRouteAction = NavigationActions.reset({
      actions: [
        NavigationActions.navigate({ routeName: 'devices' }),
        NavigationActions.navigate({
          params: { id },
          routeName: 'deviceDetails',
        }),
      ],
      index: 1,
    });
    navigation.dispatch(resetRouteAction);
  };

  render() {
    const { particleID } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="New brewskey box" />
        <DeviceForm
          device={{ particleId: particleID }}
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Create Device"
        />
      </Container>
    );
  }
}

export default NewDeviceScreen;
