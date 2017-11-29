// @flow

// todo add LocationMutator type to the lib
import type { LoadObject, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { View } from 'react-native';
import Header from '../common/Header';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  navigation: Navigation,
|};

class NewLocationScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: Location): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.LocationDAO.post(values);
    const { id } = await DAOApi.LocationDAO.waitForLoaded((): LoadObject<
      Location,
    > => DAOApi.LocationDAO.fetchByID(clientID));
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('locationDetails', { id });
  };

  render() {
    return (
      <View>
        <Header showBackButton title="New location" />
        <LocationForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Create location"
        />
      </View>
    );
  }
}

export default NewLocationScreen;
