// @flow

// todo add LocationMutator type to the lib
import type { Location } from 'brewskey.js-api';
import type { DAOEntityStore } from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import LocationForm from '../components/LocationForm';

type Props = {|
  navigation: Object,
  locationStore: DAOEntityStore<Location, Location>,
|};

@inject('locationStore')
class NewLocationScreen extends React.Component<Props> {
  _onBackButtonPress = (): void => this.props.navigation.goBack(null);

  _onFormSubmit = async (values: Location): Promise<void> => {
    const { locationStore, navigation } = this.props;
    const { id } = await locationStore.post(values);
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('locationDetails', { id });
  };

  render(): React.Element<*> {
    return (
      <LocationForm
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Create location"
      />
    );
  }
}

export default NewLocationScreen;
