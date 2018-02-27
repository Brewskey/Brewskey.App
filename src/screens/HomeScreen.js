// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import Container from '../common/Container';
import Header from '../common/Header';
import HomeScreenStore from '../stores/HomeScreenStore';
import NearbyLocationsList from '../components/NearbyLocationsList';
import HeaderSearchBar from '../common/Header/HeaderSearchBar';

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class HomeScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderSearchBar
              onChangeText={HomeScreenStore.searchTextStore.setText}
              onClearPress={HomeScreenStore.onClearSearchBar}
              onClosePress={HomeScreenStore.onClearSearchBar}
              value={HomeScreenStore.searchTextStore.text}
            />
          }
          title="Nearby locations"
        />
        <NearbyLocationsList
          isLoading={HomeScreenStore.isLoading}
          nearbyLocations={HomeScreenStore.nearbyLocations}
        />
      </Container>
    );
  }
}

export default HomeScreen;
