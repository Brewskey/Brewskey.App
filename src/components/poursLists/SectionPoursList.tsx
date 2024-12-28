import type { QueryOptions, Pour } from '@brewskey/js-api';
import type { KegSection } from '../../stores/SectionPoursListStore';

import * as React from 'react';
import moment from 'moment';
import DAOApi from '@brewskey/js-api';

import { NULL_STRING_PLACEHOLDER } from '../../constants';
import SectionPoursListStore from '../../stores/SectionPoursListStore';
import { SwipeableList } from '../../common/SwipeableList';
import QuickActions from '../../common/QuickActions';
import ListItem from '../../common/ListItem';
import UserAvatar from '../../common/avatars/UserAvatar';
import LoadingListFooter from '../../common/LoadingListFooter';
import KegSectionHeader from './KegSectionHeader';
import PintCounter from '../../components/PintCounter';
import { ListComponentTypes } from '../../common/List';
import { useDeletePour, useGetPours } from '../../hooks/queries/PourQueries';
import { useNavigation } from '@react-navigation/native';
import { useAddSnackBarMessage } from '../../hooks/context/SnackBarContext';
import { SectionListData } from 'react-native';

type Props = {
  ListHeaderComponent?: ListComponentTypes;
  canDeletePours: boolean;
  queryOptions?: QueryOptions;
};

function PourListItem({
  item: pour,
  onItemPress,
}: RowItemProps<Pour>): React.ReactElement {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      rightIcon={
        <PintCounter beverageID={pour?.beverage?.id} ounces={pour.ounces} />
      }
      onPress={onItemPress}
      chevron={false}
      item={pour}
      title={title}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );
}

function Slideout({
  item,
  onDeleteItemPress,
}: RowItemProps<Pour>): React.ReactElement {
  return (
    <QuickActions
      deleteModalMessage="Are you sure you want to delete this pour?"
      deleteModalTitle="Delete Pour"
      item={item}
      onDeleteItemPress={onDeleteItemPress}
    />
  );
}

export const SectionPoursList: React.FC<Props> = ({
  queryOptions = {},
  ListHeaderComponent,
  canDeletePours,
}) => {
  const pours = useGetPours({
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
    ...queryOptions,
  });
  const navigation = useNavigation();
  const deletePour = useDeletePour();
  const addSnackBarMessage = useAddSnackBarMessage();

  const _onItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    navigation.navigate('profile', {
      id: pour.owner.id,
    });
  };

  const _onDeleteItemPress = async (pour: Pour): Promise<void> => {
    await deletePour.mutateAsync(pour.id);
    await pours.refetch();
    addSnackBarMessage({ content: 'The pour was deleted' });
  };

  const _renderRow = (): React.ReactElement => {
    if (canDeletePours) {
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
        onDeleteItemPress={_onDeleteItemPress}
        onItemPress={_onItemPress}
        separators={separators}
      />
    );
  };

  const _keyExtractor = (pour: Pour): string => pour.id.toString();

  const allPours = (pours.data?.pages ?? []).flat();
  const kegIds = new Set(allPours.map((pour) => pour.keg.id));

  const kegWithPours = Array.from(kegIds).map((kegId) => ({
    key: kegId,
    data: allPours.filter((pour) => pour.keg.id === kegId),
  }));
  return (
    <SwipeableList
      keyExtractor={_keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={pours.isLoading} />}
      ListHeaderComponent={ListHeaderComponent}
      listType="sectionList"
      onDeleteItemPress={_onDeleteItemPress}
      onEndReached={pours.fetchNextPage}
      onRefresh={pours.refetch}
      renderItem={_renderRow}
      renderSectionHeader={KegSectionHeader}
      sections={kegWithPours}
      slideoutComponent={Slideout}
      stickySectionHeadersEnabled
    />
  );
};

export default SectionPoursList;
