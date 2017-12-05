// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { SearchBar } from 'react-native-elements';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import withComponentStores from '../common/withComponentStores';
import HomeScreenStore from '../stores/HomeScreenStore';
import NearbyLocationsList from '../components/NearbyLocationsList';

type InjectedProps = {|
  homeScreenStore: HomeScreenStore,
  navigation: Navigation,
|};

@withComponentStores({ homeScreenStore: new HomeScreenStore() })
@observer
class HomeScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { homeScreenStore } = this.injectedProps;
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderIconButton
              name={homeScreenStore.isSearchBarVisible ? 'close' : 'search'}
              onPress={homeScreenStore.toggleSearchBar}
            />
          }
          title="Nearby locations"
        />
        {homeScreenStore.isSearchBarVisible && (
          <SearchBar
            onChangeText={homeScreenStore.onChangeSearchText}
            showLoadingIcon={homeScreenStore.isLoading}
            value={homeScreenStore.searchText}
          />
        )}
        <NearbyLocationsList
          isLoading={homeScreenStore.isLoading}
          nearbyLocations={homeScreenStore.nearbyLocations}
        />
      </Container>
    );
  }
}

export default HomeScreen;
