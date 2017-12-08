// @flow

import type { Device, DeviceMutator, EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import { DeviceStore } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import nullthrows from 'nullthrows';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditDeviceForm from '../components/EditDeviceForm';

type InjectedProps = {
  id: EntityID,
  navigation: Navigation,
};

@flatNavigationParamsAndScreenProps
@observer
class EditDeviceScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: DeviceMutator) => {
    DAOApi.DeviceDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  _renderLoading = (): React.Node => <LoadingIndicator />;

  _renderLoaded = (value: Device): React.Node => (
    <EditDeviceForm device={value} onSubmit={this._onFormSubmit} />
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit Brewskey box" />
        <LoaderComponent
          loader={DeviceStore.getByID(id)}
          renderLoaded={this._renderLoaded}
          renderLoading={this._renderLoading}
        />
      </Container>
    );
  }
}

export default EditDeviceScreen;
