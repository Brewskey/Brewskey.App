// @flow

import type { EntityID, FlowSensorMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import FlowSensorForm from '../components/FlowSensorForm';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  navigation: Navigation,
  onFlowSensorCreated: () => void | Promise<any>,
  tapId: EntityID,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewFlowSensorCustomScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { onFlowSensorCreated } = this.injectedProps;
    const clientID = DAOApi.FlowSensorDAO.post(values);
    await waitForLoaded(() => FlowSensorStore.getByID(clientID));
    onFlowSensorCreated();
  };

  render() {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Set tap sensor" />
        <FlowSensorForm tapId={tapId} onSubmit={this._onFormSubmit} />
      </Container>
    );
  }
}

export default NewFlowSensorCustomScreen;
