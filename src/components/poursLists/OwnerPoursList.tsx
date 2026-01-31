import * as React from 'react';

import { useRouter } from 'expo-router';
import moment from 'moment';

import { BasePoursList } from 'components/poursLists/BasePoursList';
import { UserAvatar } from 'common/avatars/UserAvatar';
import { ListEmpty } from 'common/ListEmpty';
import { ListItem } from 'common/ListItem';
import { QuickActions } from 'common/QuickActions';
import { NULL_STRING_PLACEHOLDER } from '@/constants';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeletePour } from 'hooks/queries/PourQueries';

import type { Pour, QueryOptions } from '@brewskey/js-api';

import type { ListComponentTypes } from 'common/List';

interface Props {
  canDeletePours: boolean;
  ListHeaderComponent?: ListComponentTypes;
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
}

// todo add pour amount rendering
const LoadedRow = ({
  value: pour,
  onItemPress,
}: {
  value: Pour;
  onItemPress: (pour: Pour) => void;
}) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      chevron={false}
      item={pour}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={() => onItemPress(pour)}
      subtitle={moment(pour.pourDate).fromNow()}
      testID={`pour-item-${pour.id}`}
      title={title}
    />
  );
};

const SwipeableRowItem = ({
  item: pour,
  onItemPress,
  slideoutComponent,
}: {
  item: Pour;
  onItemPress: (pour: Pour) => void;
  slideoutComponent: React.ReactNode;
}) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      swipeable
      chevron={false}
      item={pour}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={() => onItemPress(pour)}
      slideoutComponent={slideoutComponent}
      subtitle={moment(pour.pourDate).fromNow()}
      testID={`pour-item-${pour.id}`}
      title={title}
    />
  );
};

const Slideout = ({
  item: pour,
  onDeleteItemPress,
}: {
  item: Pour;
  onDeleteItemPress: (item: Pour) => Promise<void>;
}) => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete this pour?"
    deleteModalTitle="Delete Pour"
    item={pour}
    onDeleteItemPress={onDeleteItemPress}
  />
);

const OwnerPoursList: React.FC<Props> = ({
  canDeletePours,
  ListHeaderComponent,
  onRefresh,
  queryOptions,
}) => {
  const router = useRouter();
  const deletePourMutation = useDeletePour();
  const addSnackBarMessage = useAddSnackBarMessage();

  const handleItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    router.navigate({
      pathname: '/(tabs)/profile/[id]',
      params: { id: String(pour.owner.id) },
    });
  };

  const onDeleteItemPress = async (item: Pour): Promise<void> => {
    await deletePourMutation.mutateAsync(item.id);
    addSnackBarMessage({ content: 'The pour was deleted' });
  };

  return (
    <BasePoursList
      ListEmptyComponent={<ListEmpty message="No pours" />}
      ListHeaderComponent={ListHeaderComponent}
      loadedRow={LoadedRow}
      onDeleteItemPress={canDeletePours ? onDeleteItemPress : undefined}
      onItemPress={handleItemPress}
      onRefresh={onRefresh}
      queryOptions={queryOptions}
      rowItemComponent={canDeletePours ? SwipeableRowItem : undefined}
      slideoutComponent={canDeletePours ? Slideout : undefined}
    />
  );
};

export { OwnerPoursList };
