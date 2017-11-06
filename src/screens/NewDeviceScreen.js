// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import NewDeviceForm from '../components/NewDeviceForm';

type InjectedProps = {|
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
  navigation: Navigation,
|};

@inject('deviceStore')
@observer
class NewDeviceScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'New Brewskey box',
  };

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const { deviceStore, navigation } = this.injectedProps;
    const { id } = await deviceStore.post(values);
    // todo better handle reset routes
    // it should be a bunch of navigationActions;
    navigation.goBack();
    navigation.navigate('deviceDetails', { id });
  };

  render() {
    return <NewDeviceForm onSubmit={this._onFormSubmit} />;
  }
}

export default NewDeviceScreen;
