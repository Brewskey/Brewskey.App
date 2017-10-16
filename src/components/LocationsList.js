// @flow

import type { Location } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { FlatList, StyleSheet, View } from 'react-native';
import { Spinner } from 'native-base';

import SwipeListItem from './SwipeListItem';

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: 'center',
    flex: 1,
  },
});

type Props = {|
  locationStore: DAOEntityStore<Location, Location>,
  // todo add better typing
  navigation: Object,
|};

// todo add pullToRefresh && loadingIndicator on bottom when loading
@withNavigation
@inject('locationStore')
@observer
class LocationsList extends React.Component<Props> {
  // todo move all observable/actions stuff to List store on refactoring
  @observable _lastItemIndex: boolean = 0;
  @observable _loading: boolean = false;
  @observable _refreshing: boolean = false;

  @action
  setLastItemIndex = (lastItemIndex: number) => {
    this._lastItemIndex = lastItemIndex;
  };

  @action
  setLoading = (loading: boolean) => {
    this._loading = loading;
  };

  @action
  setRefreshing = (refreshing: boolean) => {
    this._refreshing = refreshing;
  };

  async componentDidMount(): Promise<void> {
    this._fetchNextData();
  }

  // todo for some reason onEndReached called twice sometimes
  // it may be react-native bug.
  _fetchNextData = async (): Promise<void> => {
    this.setLoading(true);
    // todo hardcoded for now, some of that should be moved to props
    // after refactoring to DAOEntityList
    await this.props.locationStore.fetchMany({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      skip: this.props.locationStore.all.length,
      take: 20,
    });
    this.setLoading(false);
  };

  _keyExtractor = (item: Location): string => item.id;

  _onDeleteItemPress = (id: string): Promise<void> => {
    this.props.locationStore.deleteByID(id);
  };

  _onItemPress = (id: string): void =>
    this.props.navigation.navigate('locationDetails', {
      id,
    });

  _renderFooter = (): React.Element<*> =>
    this._loading ? (
      <View style={styles.footerContainer}>
        <Spinner />
      </View>
    ) : null;

  _renderItem = ({ item }: { item: Location }): React.Element<*> => (
    <SwipeListItem
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onItemPress={this._onItemPress}
    />
  );

  render(): React.Element<*> {
    return (
      <FlatList
        ListFooterComponent={this._renderFooter}
        onEndReached={this._fetchNextData}
        data={this.props.locationStore.all}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

export default LocationsList;
