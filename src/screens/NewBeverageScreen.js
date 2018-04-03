// @flow

import type { BeverageMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { NavigationActions } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { BeverageStore, waitForLoaded } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import BeverageForm from '../components/BeverageForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {|
  navigation: Navigation,
|};

class NewBeverageScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: BeverageMutator): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.BeverageDAO.post(values);
    const { id } = await waitForLoaded(() => BeverageStore.getByID(clientID));
    const resetRouteAction = NavigationActions.reset({
      actions: [
        NavigationActions.navigate({ routeName: 'myBeverages' }),
        NavigationActions.navigate({
          params: { id },
          routeName: 'beverageDetails',
        }),
      ],
      index: 1,
    });
    navigation.dispatch(resetRouteAction);
    SnackBarStore.showMessage({ text: 'New beverage created.' });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="New beverage" />
        <BeverageForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Create beverage"
        />
      </Container>
    );
  }
}

export default NewBeverageScreen;
