// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import NearbyLocationsList from '../components/NearbyLocationsList';

type Props = {|
  navigation: Navigation,
|};

class HomeScreen extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Header title="Nearby locations" />
        <NearbyLocationsList />
      </Container>
    );
  }
}

export default HomeScreen;
