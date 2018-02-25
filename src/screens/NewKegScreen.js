// @flow

import type { EntityID, KegMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { NavigationActions } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import { KegStore, TapStore, waitForLoaded } from '../stores/DAOStores';
import KegForm from '../components/KegForm';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedComponentProps = {
  navigation: Navigation,
  tapId: EntityID,
};

@flatNavigationParamsAndScreenProps
class NewKegScreen extends InjectedComponent<InjectedComponentProps> {
  _onFormSubmit = async (values: KegMutator): Promise<void> => {
    const { navigation, tapId } = this.injectedProps;
    const clientID = DAOApi.KegDAO.post(values);
    await waitForLoaded(() => KegStore.getByID(clientID));
    TapStore.flushCache();
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
        <Header showBackButton title="Add keg" />
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
