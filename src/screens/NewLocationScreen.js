// @flow

import type { LocationMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { LocationStore, waitForLoaded } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  navigation: Navigation,
|};

class NewLocationScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: LocationMutator): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.LocationDAO.post(values);
    const { id } = await waitForLoaded(() => LocationStore.getByID(clientID));
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('locationDetails', { id });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="New location" />
        <LocationForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Create location"
        />
      </Container>
    );
  }
}

export default NewLocationScreen;
