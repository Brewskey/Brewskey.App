// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditDeviceForm from '../components/EditDeviceForm';

type InjectedProps = {
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
  id: string,
  navigation: Navigation,
};

@flatNavigationParamsAndScreenProps
@inject('deviceStore')
class EditDeviceScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Edit Brewskey box',
  };

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    await this.injectedProps.deviceStore.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <EditDeviceForm
        onSubmit={this._onFormSubmit}
        device={this.injectedProps.deviceStore.getByID(this.injectedProps.id)}
      />
    );
  }
}

export default EditDeviceScreen;
