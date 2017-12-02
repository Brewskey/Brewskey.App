// @flow

import type {
  EntityID,
  LoadObject,
  Location,
  LocationMutator,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import Container from '../common/Container';
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
  _onFormSubmit = (values: LocationMutator) => {
    DAOApi.LocationDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit location" />
        <LocationForm
          location={this.injectedProps.entityLoader.getValueEnforcing()}
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Edit location"
        />
      </Container>
    );
  }
}

export default EditLocationScreen;
