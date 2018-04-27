// @flow

import type { EntityID, KegMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { NavigationActions } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import { KegStore, TapStore, waitForLoaded } from '../stores/DAOStores';
import SnackBarStore from '../stores/SnackBarStore';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import KegForm from '../components/KegForm';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedComponentProps = {
  navigation: Navigation,
  onTapSetupFinish?: (tapID: EntityID) => void | Promise<any>,
  tapId: EntityID,
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewKegScreen extends InjectedComponent<InjectedComponentProps> {
  _onFormSubmit = async (values: KegMutator): Promise<void> => {
    const { navigation, onTapSetupFinish, tapId } = this.injectedProps;
    const clientID = DAOApi.KegDAO.post(values);
    await waitForLoaded(() => KegStore.getByID(clientID));
    TapStore.flushCache();

    SnackBarStore.showMessage({ text: 'New keg installed' });

    if (onTapSetupFinish) {
      onTapSetupFinish(tapId);
      return;
    }

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
  };

  render() {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header title="Add keg" />
        <KegForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Add keg"
          tapId={tapId}
        />
      </Container>
    );
  }
}

export default NewKegScreen;
