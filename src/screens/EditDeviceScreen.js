// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditDeviceForm from '../components/EditDeviceForm';

type Props = {|
  deviceStore: DAOEntityStore<Tap, TapMutator>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('deviceStore')
class EditDeviceScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Edit Brewskey box',
  };

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    await this.props.deviceStore.put(values.id, values);
    this.props.navigation.goBack(null);
  };

  render(): React.Node {
    return (
      <EditDeviceForm
        onSubmit={this._onFormSubmit}
        device={this.props.deviceStore.getByID(this.props.id)}
      />
    );
  }
}

export default EditDeviceScreen;
