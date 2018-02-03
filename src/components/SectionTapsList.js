// @flow

import type { Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';
import { withNavigation } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import ListSectionHeader from '../common/ListSectionHeader';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import SectionTapsListStore from '../stores/SectionTapsListStore';
import SwipeableList from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import TapListItem from './TapListItem';

type Props = {|
  ListHeaderComponent?: React.Node,
  // todo add queryOptions?
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class SectionTapsList extends InjectedComponent<InjectedProps, Props> {
  _listStore = new SectionTapsListStore();
  _swipeableListRef: ?SwipeableList<Tap>;

  componentWillMount() {
    this._listStore.fetchFirstPage();
  }

  _getSwipeableListRef = ref => {
    this._swipeableListRef = ref;
  };

  _keyExtractor = ({ id }: Tap): string => id.toString();

  _onItemPress = (item: Tap): void =>
    this.injectedProps.navigation.navigate('tapDetails', {
      id: item.id,
    });

  _onDeleteItemPress = (item: Tap): void => DAOApi.TapDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _renderSectionHeader = ({ section }): React.Node => (
    <ListSectionHeader title={section.title} />
  );

  _renderRow = ({
    info: { item, index, separators },
    ...swipeableStateProps
  }): React.Node => (
    <SwipeableRow
      {...swipeableStateProps}
      index={index}
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
      onItemPress={this._onItemPress}
      rowItemComponent={SwipeableRowItem}
      separators={separators}
      slideoutComponent={Slideout}
    />
  );

  render() {
    return (
      <SwipeableList
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter isLoading={this._listStore.isLoading} />
        }
        listType="sectionList"
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        ref={this._getSwipeableListRef}
        renderItem={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        sections={this._listStore.sections}
        stickySectionHeadersEnabled
      />
    );
  }
}

const SwipeableRowItem = ({
  index,
  item,
  onItemPress,
}: RowItemProps<Tap, *>) => (
  <TapListItem index={index} onPress={onItemPress} tap={item} />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<
  Tap,
  {
    onDeleteItemPress: () => void,
    onEditItemPress: () => void,
  },
>) => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete the Tap"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default SectionTapsList;
