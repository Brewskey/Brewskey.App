import type { Beverage, QueryOptions } from '@brewskey/js-api';

import type { RenderProps } from '../common/SwipeableList';

import * as React from 'react';
import { View } from 'react-native';

import BeverageAvatar from '../common/avatars/BeverageAvatar';
import QuickActions from '../common/QuickActions';
import { SwipeableList } from '../common/SwipeableList';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import ListEmpty from '../common/ListEmpty';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';
import {
  useDeleteBeverageById,
  useGetBeverages,
} from '../hooks/queries/BeverageQueries';
import { useRouter } from 'expo-router';

type Props = {
  ListHeaderComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  queryOptions?: QueryOptions;
};

const Slideout = ({ item }: { item: Beverage }): React.ReactElement => {
  const router = useRouter();
  const deleteBeverage = useDeleteBeverageById();
  const addSnackBarMessage = useAddSnackBarMessage();
  const onDeleteItemPress = async (deleteItem: Beverage): Promise<void> => {
    await deleteBeverage.mutate(deleteItem.id);
    addSnackBarMessage({ content: 'The beverage was deleted' });
  };
  const onEditItemPress = ({ id }: Beverage) => {
    router.navigate(`/(tabs)/beverages/${id}/edit`);
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
  const router = useRouter();
  const beverages = useGetBeverages({
    ...queryOptions,
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
  });

  const keyExtractor = (row: Beverage): string => row.id.toString();

  const onItemPress = (item: Beverage): void =>
    router.navigate(`/(tabs)/beverages/${item.id}`);

  const renderRow = ({
    info: { item },
  }: RenderProps<Beverage>): React.ReactElement => (
    <ListItem
      swipeable
      slideoutComponent={<Slideout item={item} />}
      leftAvatar={<BeverageAvatar beverageId={item.id} />}
      chevron={false}
      item={item}
      onPress={onItemPress}
      subtitle={item.beverageType}
      title={item.name}
      testID={`beverage-item-${item.id}`}
    />
  );

  const isLoading = beverages.isLoading;
  return (
    <View testID="beverages-list" style={{ flex: 1 }}>
      <SwipeableList<Beverage>
        listType="flatList"
        data={beverages.data}
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
    </View>
  );
};

export default BeveragesList;
