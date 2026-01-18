import type { QueryOptions, Pour } from '@brewskey/js-api';

import * as React from 'react';
import moment from 'moment';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import ListEmpty from '../../common/ListEmpty';
import ListItem from '../../common/ListItem';
import UserAvatar from '../../common/avatars/UserAvatar';
import QuickActions from '../../common/QuickActions';
import BasePoursList from './BasePoursList';
import { useAddSnackBarMessage } from '../../hooks/context/SnackBarContext';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { useDeletePour } from '../../hooks/queries/PourQueries';

import { ListComponentTypes } from '../../common/List';

type Props = {
  canDeletePours: boolean;
  ListHeaderComponent?: ListComponentTypes;
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
};

// todo add pour amount rendering
const LoadedRow = ({ value: pour, onItemPress }: { value: Pour; onItemPress: (pour: Pour) => void }) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      chevron={false}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={() => onItemPress(pour)}
      item={pour}
      title={title}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );
};

const SwipeableRowItem = ({ item: pour, onItemPress, slideoutComponent }: { item: Pour; onItemPress: (pour: Pour) => void; slideoutComponent: React.ReactNode }) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      swipeable={true}
      slideoutComponent={slideoutComponent}
      chevron={false}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={() => onItemPress(pour)}
      item={pour}
      title={title}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );
};

const Slideout = ({ item: pour, onDeleteItemPress }: { item: Pour; onDeleteItemPress: (item: Pour) => Promise<void> }) => (
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
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const deletePourMutation = useDeletePour();
  const addSnackBarMessage = useAddSnackBarMessage();

  const handleItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'profile',
        params: {
          id: pour.owner.id,
        },
         
      } as any,
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

export default OwnerPoursList;
