// @flow

import type { Location } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LocationForm from '../components/LocationForm';

type Props = {|
  id: string,
  locationStore: DAOEntityStore<Location, Location>,
  navigation: Object,
|};

@flatNavigationParamsAndScreenProps
@inject('locationStore')
class EditLocationScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Edit location',
  };

  _onFormSubmit = async (values: Location): Promise<void> => {
    await this.props.locationStore.put(values.id, values);
    this.props.navigation.goBack(null);
  };

  render(): React.Element<*> {
    return (
      <LocationForm
        location={this.props.locationStore.getByID(this.props.id)}
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit location"
      />
    );
  }
}

export default EditLocationScreen;
