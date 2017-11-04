// @flow

import type { Location } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LocationForm from '../components/LocationForm';

type InjectedProps = {|
  id: string,
  locationStore: DAOEntityStore<Location, Location>,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('locationStore')
class EditLocationScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Edit location',
  };

  _onFormSubmit = async (values: Location): Promise<void> => {
    await this.injectedProps.locationStore.put(values.id, values);
    this.injectedProps.navigation.goBack(null);
  };

  render(): React.Node {
    return (
      <LocationForm
        location={this.injectedProps.locationStore.getByID(
          this.injectedProps.id,
        )}
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit location"
      />
    );
  }
}

export default EditLocationScreen;
