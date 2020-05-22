// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';
import type { Navigation } from '../../types';
import type { RowItemProps } from '../../common/SwipeableRow';
import type { KegSection } from '../../stores/SectionPoursListStore';

import * as React from 'react';
import moment from 'moment';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import InjectedComponent from '../../common/InjectedComponent';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import SectionPoursListStore from '../../stores/SectionPoursListStore';
import SwipeableList from '../../common/SwipeableList';
import QuickActions from '../../common/QuickActions';
import ListItem from '../../common/ListItem';
import SwipeableRow from '../../common/SwipeableRow';
import UserAvatar from '../../common/avatars/UserAvatar';
import LoadingListFooter from '../../common/LoadingListFooter';
import KegSectionHeader from './KegSectionHeader';
import SnackBarStore from '../../stores/SnackBarStore';

type InjectedProps = {
  navigation: Navigation,
};

type Props = {
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  canDeletePours: boolean,
  queryOptions?: QueryOptions,
};

@withNavigation
@observer
class SectionPoursList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore = new SectionPoursListStore();

  componentDidMount() {
    this._listStore.initialize({
      ...this.props.queryOptions,
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
    });
  }

  _onItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    this.injectedProps.navigation.navigate('profile', {
      id: pour.owner.id,
    });
  };

  _onDeleteItemPress: (Pour) => void = (pour: Pour): void => {
    (async () => {
      const clientID = DAOApi.PourDAO.deleteByID(pour.id);
      await DAOApi.PourDAO.waitForLoadedNullable((dao) =>
        dao.fetchByID(clientID),
      );
      SnackBarStore.showMessage({ text: 'The pour was deleted' });
    })();
  };

  _renderSectionHeader = ({ section }: { section: KegSection }) => (
    <KegSectionHeader section={section} />
  );

  _renderRow = ({
    info: { item, index, separators },
    isOpen,
    onClose,
    onOpen,
    rowKey,
    shouldBounceOnMount,
    ...swipeableStateProps
  }): React.Node => {
    if (this.props.canDeletePours) {
      return (
        <SwipeableRow
          index={index}
          isOpen={isOpen}
          item={item}
          onDeleteItemPress={this._onDeleteItemPress}
          onItemPress={this._onItemPress}
          onClose={onClose}
          onOpen={onOpen}
          rowItemComponent={PourListItem}
          rowKey={rowKey}
          separators={separators}
          shouldBounceOnMount={shouldBounceOnMount}
          slideoutComponent={Slideout}
        />
      );
    }

    return (
      <PourListItem
        index={index}
        item={item}
        onDeleteItemPress={this._onDeleteItemPress}
        onItemPress={this._onItemPress}
        separators={separators}
      />
    );
  };

  _keyExtractor = (pour: Pour): string => pour.id.toString();

  render(): React.Node {
    const { ListHeaderComponent } = this.props;

    return (
      <SwipeableList
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter isLoading={this._listStore.isLoading} />
        }
        ListHeaderComponent={ListHeaderComponent}
        listType="sectionList"
        onDeleteItemPress={this._onDeleteItemPress}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        renderItem={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        sections={(this._listStore.sections: any)}
        slideoutComponent={Slideout}
        stickySectionHeadersEnabled
      />
    );
  }
}

function PourListItem({
  item: pour,
  onItemPress,
}: RowItemProps<Pour>): React.Node {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={onItemPress}
      chevron={false}
      item={pour}
      title={title}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );
}

function Slideout({ item, onDeleteItemPress }: RowItemProps<Pour>): React.Node {
  return (
    <QuickActions
      deleteModalMessage="Are you sure you want to delete this pour?"
      deleteModalTitle="Delete Pour"
      item={item}
      onDeleteItemPress={onDeleteItemPress}
    />
  );
}

export default SectionPoursList;
