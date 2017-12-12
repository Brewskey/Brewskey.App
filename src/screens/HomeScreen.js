// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { SearchBar } from 'react-native-elements';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import HomeScreenStore from '../stores/HomeScreenStore';
import NearbyLocationsList from '../components/NearbyLocationsList';

type InjectedProps = {|
  homeScreenStore: HomeScreenStore,
  navigation: Navigation,
|};

@observer
class HomeScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderIconButton
              name={HomeScreenStore.isSearchBarVisible ? 'close' : 'search'}
              onPress={HomeScreenStore.toggleSearchBar}
            />
          }
          title="Nearby locations"
        />
        {HomeScreenStore.isSearchBarVisible && (
          <SearchBar
            onChangeText={HomeScreenStore.onSearchTextChange}
            showLoadingIcon={HomeScreenStore.isLoading}
            value={HomeScreenStore.searchText}
          />
        )}
        <NearbyLocationsList
          isLoading={HomeScreenStore.isLoading}
          nearbyLocations={HomeScreenStore.nearbyLocations}
        />
      </Container>
    );
  }
}

export default HomeScreen;
