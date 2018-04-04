// @flow

import type { EntityID, FlowSensorMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { NavigationActions } from 'react-navigation';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import FlowSensorForm from '../components/FlowSensorForm';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  navigation: Navigation,
  returnOnFinish?: boolean,
  showBackButton?: boolean,
  tapId: EntityID,
|};

@flatNavigationParamsAndScreenProps
class NewFlowSensorScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { navigation, returnOnFinish, tapId } = this.injectedProps;
    const clientID = DAOApi.FlowSensorDAO.post(values);
    await waitForLoaded(() => FlowSensorStore.getByID(clientID));

    if (returnOnFinish) {
      const resetRouteAction = NavigationActions.reset({
        actions: [
          NavigationActions.navigate({ routeName: 'taps' }),
          NavigationActions.navigate({
            params: { id: tapId },
            routeName: 'tapDetails',
          }),
        ],
        index: 1,
      });
      navigation.dispatch(resetRouteAction);
    } else {
      navigation.navigate('newKeg', { tapId });
    }
  };

  render() {
    const { tapId, showBackButton } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton={showBackButton} title="Set tap sensor" />
        <FlowSensorForm tapId={tapId} onSubmit={this._onFormSubmit} />
      </Container>
    );
  }
}

export default NewFlowSensorScreen;
