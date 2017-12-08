// @flow

import type { DeviceMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { DeviceStore, waitForLoaded } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import NewDeviceForm from '../components/NewDeviceForm';

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class NewDeviceScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.DeviceDAO.post(values);
    const { id } = await waitForLoaded(() => DeviceStore.getByID(clientID));
    // todo better handle reset routes
    // it should be a bunch of navigationActions;
    navigation.goBack();
    navigation.navigate('deviceDetails', { id });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="New brewskey box" />
        <NewDeviceForm onSubmit={this._onFormSubmit} />
      </Container>
    );
  }
}

export default NewDeviceScreen;
