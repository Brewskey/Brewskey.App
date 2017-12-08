// @flow

import type { EntityID, Location, LocationMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { LocationStore } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditLocationScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = (values: LocationMutator) => {
    DAOApi.LocationDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  _renderLoading = (): React.Node => <LoadingIndicator />;

  _renderLoaded = (value: Location): React.Node => (
    <LocationForm
      location={value}
      onSubmit={this._onFormSubmit}
      submitButtonLabel="Edit location"
    />
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit location" />
        <LoaderComponent
          loader={LocationStore.getByID(id)}
          renderLoaded={this._renderLoaded}
          renderLoading={this._renderLoading}
        />
      </Container>
    );
  }
}

export default EditLocationScreen;
