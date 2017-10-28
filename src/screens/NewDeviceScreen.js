// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import NewDeviceForm from '../components/NewDeviceForm';

type Props = {|
  navigation: Object,
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
|};

@inject('deviceStore')
@observer
class NewDeviceScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'New Brewskey box',
  };

  _onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const { deviceStore, navigation } = this.props;
    const { id } = await deviceStore.post(values);
    // todo better handle reset routes
    // it should be a bunch of navigationActions;
    navigation.goBack();
    navigation.navigate('deviceDetails', { id });
  };

  render(): React.Node {
    return <NewDeviceForm onSubmit={this._onFormSubmit} />;
  }
}

export default NewDeviceScreen;
