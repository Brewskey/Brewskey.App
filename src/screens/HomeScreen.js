// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { observer } from 'mobx-react';
import NearbyLocationsList from '../components/NearbyLocationsList';

type Props = {|
  navigation: Navigation,
|};

@observer
class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    drawerLabel: 'Home',
    title: 'Nearby locations',
  };

  render() {
    return <NearbyLocationsList />;
  }
}

export default HomeScreen;
