// @flow

import type { EntityID, LoadObject, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { View } from 'react-native';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  entityLoader: LoadObject<Location>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.LocationDAO)
@withLoadingActivity()
class EditLocationScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = (values: Location) => {
    DAOApi.LocationDAO.put(values.id, values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <View>
        <Header showBackButton title="Edit location" />
        <LocationForm
          location={this.injectedProps.entityLoader.getValueEnforcing()}
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Edit location"
        />
      </View>
    );
  }
}

export default EditLocationScreen;
