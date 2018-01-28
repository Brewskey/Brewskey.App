// @flow

import type { Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { observer } from 'mobx-react';
import { SectionList } from 'react-native';
import DAOApi from 'brewskey.js-api';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import ListItem from '../common/ListItem';
import ListSectionHeader from '../common/ListSectionHeader';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import SectionTapsListStore from '../stores/SectionTapsListStore';
import SwipeableSectionList from '../common/SwipeableSectionList';
import SwipeableRow from '../common/SwipeableRow';

type Props = {|
  ListHeaderComponent?: React.Node,
  // todo add queryOptions?
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class SectionTapsList extends InjectedComponent<InjectedProps, Props> {
  _listStore = new SectionTapsListStore();
  _swipeableSectionListRef: ?SwipeableSectionList<Tap>;

  componentWillMount() {
    this._listStore.fetchFirstPage();
  }

  _getSwipeableSectionListRef = ref => {
    this._swipeableSectionListRef = ref;
  };

  _keyExtractor = ({ id }: Tap): string => id.toString();

  _onDeleteItemPress = (item: Tap): void => DAOApi.TapDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id });
    nullthrows(this._swipeableSectionListRef).resetOpenRow();
  };

  _renderSectionHeader = ({ section }): React.Node => (
    <ListSectionHeader title={section.title} />
  );

  _renderRow = ({ info, ...swipeableStateProps }): React.Node => (
    <SwipeableRow
      {...swipeableStateProps}
      info={info}
      renderListItem={this._renderListItem}
      renderSlideoutView={this._renderSlideoutView}
    />
  );

  _renderListItem = ({
    index,
    item,
  }: {
    index: number,
    item: Tap,
  }): React.Node => {
    const beverage = item.currentKeg ? item.currentKeg.beverage : null;
    const beverageName = beverage ? beverage.name : 'No Beer on Tap';

    return (
      <ListItem
        avatar={<BeverageAvatar beverageId={beverage ? beverage.id : ''} />}
        hideChevron
        item={item}
        title={`${index + 1} - ${beverageName}`}
      />
    );
  };

  _renderSlideoutView = ({
    item,
  }: {
    index: number,
    item: Tap,
  }): React.Node => (
    <QuickActions
      deleteModalMessage="Are you sure you want to delete the Tap"
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  render() {
    return (
      <SwipeableSectionList
        listComponent={SectionList}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter isLoading={this._listStore.isLoading} />
        }
        onEndReached={this._listStore.fetchNextPage}
        ref={this._getSwipeableSectionListRef}
        onRefresh={this._listStore.reload}
        renderItem={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        sections={this._listStore.sections}
        stickySectionHeadersEnabled
      />
    );
  }
}

export default SectionTapsList;
