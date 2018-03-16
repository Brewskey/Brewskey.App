// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import LocationsList from '../components/LocationsList';

type Props = {|
  navigation: Navigation,
|};

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
        <LocationsList />
      </Container>
    );
  }
}

export default LocationsScreen;
