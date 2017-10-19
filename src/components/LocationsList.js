// @flow

import type { Location } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import SwipeableFlatList from '../common/SwipeableFlatList';
import SwipeableActionButton from '../common/SwipeableFlatList/SwipeableActionButton';
// imported from experimental react-native
// eslint-disable-next-line
import SwipeableQuickActions from 'SwipeableQuickActions';

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  // eslint-disable-next-line react-native/no-color-literals
  listItem: {
    backgroundColor: 'white',
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
  _swipeableFlatListRef: ?SwipeableFlatList;
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
    await this._fetchNextData();
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

  _onDeleteItemPress = (id: string): Function => async (): Promise<void> => {
    await this.props.locationStore.deleteByID(id);
  };

  _onEditItemPress = (id: string): Function => () => {
    this.props.navigation.navigate('editLocation', { id });
    this._swipeableFlatListRef.resetOpenRow();
  };

  _onItemPress = (id: string): Function => (): void =>
    this.props.navigation.navigate('locationDetails', {
      id,
    });

  _onEndReached = () => {
    // todo onEndReach works very unstable.
    // calls many times or not calls when it needed
    // this causes wrong fetching logic
    // figure out why
    if (this.loading) {
      return;
    }
    this._fetchNextData();
  };

  _renderFooter = (): React.Element<*> =>
    this._loading ? (
      <View style={styles.footerContainer}>
        <Text>Loading...</Text>
      </View>
    ) : null;

  _renderItem = ({ item }: { item: Location }): React.Element<*> => (
    <ListItem
      key={item.id}
      containerStyle={styles.listItem}
      hideChevron
      onPress={this._onItemPress(item.id)}
      subtitle={item.summary || '-'}
      title={item.name}
    />
  );

  _renderQuickActions = ({ item }: { item: Location }): React.Element<*> => (
    <SwipeableQuickActions>
      <SwipeableActionButton
        iconName="create"
        onPress={this._onEditItemPress(item.id)}
      />
      <SwipeableActionButton
        iconName="delete"
        onPress={this._onDeleteItemPress(item.id)}
      />
    </SwipeableQuickActions>
  );

  render(): React.Element<*> {
    return (
      <SwipeableFlatList
        data={this.props.locationStore.all}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={this._renderFooter}
        maxSwipeDistance={150}
        maxToRenderPerBatch={20}
        onEndReached={this._onEndReached}
        onEndThreshold={0.5}
        preventSwipeRight
        ref={(ref: SwipeableFlatList) => {
          this._swipeableFlatListRef = ref;
        }}
        renderItem={this._renderItem}
        renderQuickActions={this._renderQuickActions}
      />
    );
  }
}

export default LocationsList;
