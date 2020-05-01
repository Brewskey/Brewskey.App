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
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { LocationStore } from '../stores/DAOStores';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import LoaderComponent from '../common/LoaderComponent';
import SnackBarStore from '../stores/SnackBarStore';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LocationForm from '../components/LocationForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class EditLocationScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _locationLoader(): LoadObject<Location> {
    return LocationStore.getByID(this.injectedProps.id);
  }

  _onFormSubmit = async (values: LocationMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.LocationDAO.put(id, values);
    await DAOApi.LocationDAO.waitForLoaded((dao) => dao.fetchByID(id));
    this.injectedProps.navigation.goBack(null);
    SnackBarStore.showMessage({ text: 'Location edited.' });
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit location" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <LoaderComponent
            loadedComponent={LoadedComponent}
            loader={this._locationLoader}
            onFormSubmit={this._onFormSubmit}
            updatingComponent={LoadedComponent}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: LocationMutator) => void,
  value: Location,
};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => (
  <LocationForm
    location={value}
    onSubmit={onFormSubmit}
    submitButtonLabel="Edit location"
  />
);

export default EditLocationScreen;
