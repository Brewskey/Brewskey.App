// @flow

import type { EntityID, FlowSensorMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import FlowSensorForm from '../components/FlowSensorForm';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  navigation: Navigation,
  tapId: EntityID,
|};

@flatNavigationParamsAndScreenProps
class NewFlowSensorScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { navigation, tapId } = this.injectedProps;
    const clientID = DAOApi.FlowSensorDAO.post(values);
    // todo promise never resolves for some reason
    // but it should like in all other similar cases
    await waitForLoaded(() => FlowSensorStore.getByID(clientID));
    navigation.goBack(null);
    navigation.navigate('tapDetails', { id: tapId });
  };

  render() {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header title="Set tap sensor" />
        <FlowSensorForm tapId={tapId} onSubmit={this._onFormSubmit} />
      </Container>
    );
  }
}

export default NewFlowSensorScreen;
