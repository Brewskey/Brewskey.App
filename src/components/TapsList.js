// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { InfiniteLoaderChildProps } from './InfiniteLoader';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import SwipeableFlatList from '../common/SwipeableFlatList';
import SwipeableActionButton from '../common/SwipeableFlatList/SwipeableActionButton';
// imported from experimental react-native
// eslint-disable-next-line
import SwipeableQuickActions from 'SwipeableQuickActions';
import InfiniteLoader from './InfiniteLoader';

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  listItem: {
    backgroundColor: 'white',
  },
});

type Props = {|
  tapStore: DAOEntityStore<Tap, TapMutator>,
  // todo add better typing
  navigation: Object,
|};

// todo add pullToRefresh
@withNavigation
@inject('tapStore')
@observer
class TapsList extends React.Component<Props> {
  _swipeableFlatListRef: ?SwipeableFlatList;

  _fetchNextData = async (): Promise<void> => {
    await this.props.tapStore.fetchMany({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      skip: this.props.tapStore.all.length,
      take: 20,
    });
  };

  _keyExtractor = (item: Tap): string => item.id;

  _onDeleteItemPress = (id: string): Function => async (): Promise<void> => {
    await this.props.tapStore.deleteByID(id);
  };

  _onEditItemPress = (id: string): Function => () => {
    this.props.navigation.navigate('editTap', { id });
    this._swipeableFlatListRef.resetOpenRow();
  };

  _onItemPress = (id: string): Function => (): void =>
    this.props.navigation.navigate('tapDetails', {
      id,
    });

  _renderItem = ({ item }: { item: Tap }): React.Node => (
    <ListItem
      containerStyle={styles.listItem}
      hideChevron
      key={item.id}
      onPress={this._onItemPress(item.id)}
      subtitle={item.description || '-'}
      title={item.name}
    />
  );

  _renderQuickActions = ({ item }: { item: Tap }): React.Element<*> => (
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

  render(): React.Node {
    return (
      <InfiniteLoader fetchNextData={this._fetchNextData}>
        {({
          loadingIndicator,
          onEndReached,
          onEndReachedThreshold,
        }: InfiniteLoaderChildProps): React.Node => (
          <SwipeableFlatList
            data={this.props.tapStore.all}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={loadingIndicator}
            maxSwipeDistance={150}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            preventSwipeRight
            ref={(ref: SwipeableFlatList) => {
              this._swipeableFlatListRef = ref;
            }}
            renderItem={this._renderItem}
            renderQuickActions={this._renderQuickActions}
          />
        )}
      </InfiniteLoader>
    );
  }
}

export default TapsList;
