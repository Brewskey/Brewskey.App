// @flow

import type { EntityID, FlowSensorMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import FlowSensorForm from '../components/FlowSensorForm';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    await DAOApi.FlowSensorDAO.waitForLoaded((dao) => dao.fetchByID(clientID));
    onFlowSensorCreated();
  };

  render(): React.Node {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Set tap sensor" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <FlowSensorForm tapId={tapId} onSubmit={this._onFormSubmit} />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default NewFlowSensorCustomScreen;
