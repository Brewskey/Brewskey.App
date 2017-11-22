// @flow

// todo add LocationMutator type to the lib
import type { LoadObject, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  navigation: Navigation,
|};

class NewLocationScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'New location',
  };

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
      <LocationForm
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Create location"
      />
    );
  }
}

export default NewLocationScreen;
