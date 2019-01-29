// @flow

import type { Location, LocationMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import Header from '../common/Header';
import LocationForm from '../components/LocationForm';
import SnackBarStore from '../stores/SnackBarStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type InjectedProps = {|
  navigation: Navigation,
  onLocationCreated?: (location: Location) => void | Promise<any>,
  showBackButton?: boolean,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewLocationScreen extends InjectedComponent<InjectedProps> {
  static defaultProps = {
    showBackButton: true,
  };

  _onFormSubmit = async (values: LocationMutator): Promise<void> => {
    const { navigation, onLocationCreated } = this.injectedProps;
    const clientID = DAOApi.LocationDAO.post(values);
    const location = await DAOApi.LocationDAO.waitForLoaded(dao =>
      dao.fetchByID(clientID),
    );
    SnackBarStore.showMessage({ text: 'New location created' });

    if (onLocationCreated) {
      onLocationCreated(location);
      return;
    }

    const resetRouteAction = StackActions.reset({
      actions: [
        NavigationActions.navigate({ routeName: 'locations' }),
        NavigationActions.navigate({
          params: { id: location.id },
          routeName: 'locationDetails',
        }),
      ],
      index: 1,
    });
    navigation.dispatch(resetRouteAction);
  };

  render() {
    return (
      <Container>
        <Header
          showBackButton={this.injectedProps.showBackButton}
          title="New location"
        />
        <KeyboardAwareScrollView>
          <LocationForm
            onSubmit={this._onFormSubmit}
            submitButtonLabel="Create location"
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default NewLocationScreen;
