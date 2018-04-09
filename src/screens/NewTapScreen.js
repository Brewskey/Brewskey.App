// @flow

import type { TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import { TapStore, waitForLoaded } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import TapForm from '../components/TapForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
class NewTapScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.TapDAO.post(values);
    const { id } = await waitForLoaded(() => TapStore.getByID(clientID));
    navigation.navigate('newFlowSensor', { tapId: id });
    SnackBarStore.showMessage({ text: 'New tap created' });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="New tap" />
        <TapForm onSubmit={this._onFormSubmit} submitButtonLabel="Create tap" />
      </Container>
    );
  }
}

export default NewTapScreen;
