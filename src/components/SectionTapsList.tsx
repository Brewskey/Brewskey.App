import type { Tap } from '@brewskey/js-api';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';

import nullthrows from 'nullthrows';
import DAOApi from '@brewskey/js-api';
import ListSectionHeader from '../common/ListSectionHeader';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import SectionTapsListStore from '../stores/SectionTapsListStore';
import SwipeableList, { RenderProps } from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import TapListItem from './TapListItem';
import SnackBarStore from '../hooks/context/SnackBarContext';
import { useDeleteTap } from '../hooks/queries/TapQueries';
import { SectionListData } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  ListEmptyComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  ListHeaderComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  // todo add queryOptions?
};

const SwipeableRowItem = ({
  index,
  item,
  onItemPress,
}: RowItemProps<Tap>): React.ReactElement => (
  <TapListItem index={index} onPress={onItemPress} tap={item} />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Tap>): React.ReactElement => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete the Tap"
    deleteModalTitle="Delete tap"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export class SectionTapsList extends React.Component<Props> {
  _listStore = new SectionTapsListStore();

  _swipeableListRef: SwipeableList<Tap> | null | undefined;

  componentDidMount() {
    this._listStore.initialize();
  }

  _getSwipeableListRef = (ref: SwipeableList<Tap> | null | undefined) => {
    this._swipeableListRef = ref;
  };

  _keyExtractor = ({ id }: Tap): string => id.toString();

  _onItemPress = (item: Tap): void => {
    const navigation = useNavigation();
    navigation.navigate('tapDetails', {
      id: item.id,
    });
  };

  // _onDeleteItemPress = (item: Tap): void => {
  //   (async () => {
  //     const clientID = DAOApi.TapDAO.deleteByID(item.id);
  //     await DAOApi.TapDAO.waitForLoadedNullable((dao) =>
  //       dao.fetchByID(clientID),
  //     );
  //     SnackBarStore.showMessage({ text: 'The tap was deleted' });
  //   })();
  // };

  _onEditItemPress = ({ id }: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<Tap>;
  }): React.ReactElement => <ListSectionHeader title={section.title} />;

  _renderRow = ({
    info: { item, index, separators },
    ...swipeableStateProps
  }: RenderProps<Tap>): React.ReactElement => {
    const deleteTap = useDeleteTap();
    return (
      <SwipeableRow
        {...swipeableStateProps}
        index={index}
        item={item}
        onDeleteItemPress={async (tap): Promise<void> => {
          await deleteTap.mutateAsync(tap.id);
          SnackBarStore.showMessage({ content: 'The tap was deleted' });
        }}
        onEditItemPress={this._onEditItemPress}
        onItemPress={this._onItemPress}
        rowItemComponent={SwipeableRowItem}
        separators={separators}
        slideoutComponent={Slideout}
      />
    );
  };

  render(): React.ReactElement {
    return (
      <SwipeableList
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          this._listStore.isLoading ? undefined : this.props.ListEmptyComponent
        }
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
