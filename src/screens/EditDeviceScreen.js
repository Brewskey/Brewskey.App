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
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditDeviceForm from '../components/EditDeviceForm';

type InjectedProps = {
  entityLoader: LoadObject<Device>,
  id: EntityID,
  navigation: Navigation,
};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.DeviceDAO)
@withLoadingActivity()
class EditDeviceScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Edit Brewskey box',
  };

  _onFormSubmit = async (values: DeviceMutator) => {
    DAOApi.DeviceDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <EditDeviceForm
        onSubmit={this._onFormSubmit}
        device={this.injectedProps.entityLoader.getValueEnforcing()}
      />
    );
  }
}

export default EditDeviceScreen;
