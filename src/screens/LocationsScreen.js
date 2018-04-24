// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import LocationsList from '../components/LocationsList';
import NuxNoEntity from '../components/NuxNoEntity';

type Props = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
class LocationsScreen extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newLocation" />
          }
          showBackButton
          title="Locations"
        />
        <LocationsList ListEmptyComponent={NuxNoEntity} />
      </Container>
    );
  }
}

export default LocationsScreen;
