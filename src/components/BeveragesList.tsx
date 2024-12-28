import type { Beverage, QueryOptions } from '@brewskey/js-api';

import type { RenderProps } from '../common/SwipeableList';

import * as React from 'react';

import BeverageAvatar from '../common/avatars/BeverageAvatar';
import QuickActions from '../common/QuickActions';
import { SwipeableList } from '../common/SwipeableList';
import SnackBarStore from '../hooks/context/SnackBarContext';
import ListEmpty from '../common/ListEmpty';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';
import {
  useDeleteBeverageById,
  useGetBeverages,
} from '../hooks/queries/BeverageQueries';
import { useNavigation } from '@react-navigation/native';

type Props = {
  ListHeaderComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  queryOptions?: QueryOptions;
};

const Slideout = ({ item }: { item: Beverage }): React.ReactElement => {
  const navigation = useNavigation();
  const deleteBeverage = useDeleteBeverageById();
  const onDeleteItemPress = async (deleteItem: Beverage): Promise<void> => {
    await deleteBeverage.mutate(deleteItem.id);
    SnackBarStore.showMessage({ content: 'The beverage was deleted' });
  };
  const onEditItemPress = ({ id }: Beverage) => {
    navigation.navigate('editBeverage', { id });
  };

  return (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      deleteModalTitle="Delete beverage"
      item={item}
      onDeleteItemPress={onDeleteItemPress}
      onEditItemPress={onEditItemPress}
    />
  );
};

export const BeveragesList: React.FC<Props> = ({
  queryOptions,
  ListHeaderComponent,
}) => {
  const navigation = useNavigation();
  const beverages = useGetBeverages({
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
    ...queryOptions,
  });

  const keyExtractor = (row: Beverage): string => row.id.toString();

  const onItemPress = (item: Beverage): void =>
    navigation.navigate('beverageDetails', {
      id: item.id,
    });

  const renderRow = ({
    info: { item },
  }: RenderProps<Beverage>): React.ReactElement => (
    <ListItem
      slideoutComponent={Slideout}
      leftAvatar={<BeverageAvatar beverageId={item.id} />}
      chevron={false}
      item={item}
      onPress={onItemPress}
      subtitle={item.beverageType}
      title={item.name}
    />
  );

  const isLoading = beverages.isLoading;
  return (
    <SwipeableList<Beverage>
      listType="flatList"
      data={beverages.data ?? []}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        !isLoading ? <ListEmpty message="No beverages" /> : null
      }
      onEndReached={beverages.fetchNextPage}
      onRefresh={beverages.refetch}
      renderItem={renderRow}
    />
  );
};

export default BeveragesList;
