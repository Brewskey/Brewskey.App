import * as React from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BeverageAvatar } from '../common/avatars/BeverageAvatar';
import { ListEmpty } from '../common/ListEmpty';
import { ListItem } from '../common/ListItem';
import { LoadingListFooter } from '../common/LoadingListFooter';
import { QuickActions } from '../common/QuickActions';
import { SwipeableList } from '../common/SwipeableList';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import {
  useDeleteBeverageById,
  useGetBeverages,
} from '../hooks/queries/BeverageQueries';

import type { Beverage, QueryOptions } from '@brewskey/js-api';

import type { RenderProps } from '../common/SwipeableList';

interface Props {
  ListHeaderComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  queryOptions?: QueryOptions;
}

const Slideout = ({ item }: { item: Beverage }): React.ReactElement => {
  const router = useRouter();
  const deleteBeverage = useDeleteBeverageById();
  const addSnackBarMessage = useAddSnackBarMessage();
  const onDeleteItemPress = async (deleteItem: Beverage): Promise<void> => {
    await deleteBeverage.mutate(deleteItem.id);
    addSnackBarMessage({ content: 'The beverage was deleted' });
  };
  const onEditItemPress = ({ id }: Beverage) => {
    router.navigate({
      pathname: '/(tabs)/beverages/[id]/edit',
      params: { id: String(id) },
    });
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
    router.navigate({
      pathname: '/(tabs)/beverages/[id]',
      params: { id: String(item.id) },
    });

  const renderRow = ({
    info: { item },
  }: RenderProps<Beverage>): React.ReactElement => (
    <ListItem
      swipeable
      chevron={false}
      item={item}
      leftAvatar={<BeverageAvatar beverageId={item.id} />}
      onPress={onItemPress}
      slideoutComponent={<Slideout item={item} />}
      subtitle={item.beverageType}
      testID={`beverage-item-${item.id}`}
      title={item.name}
    />
  );

  const { isLoading } = beverages;
  return (
    <View style={{ flex: 1 }} testID="beverages-list">
      <SwipeableList<Beverage>
        data={beverages.data}
        keyExtractor={keyExtractor}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        listType="flatList"
        onEndReached={beverages.fetchNextPage}
        onRefresh={() => {
          void beverages.refetch();
        }}
        renderItem={renderRow}
        ListEmptyComponent={
          !isLoading ? <ListEmpty message="No beverages" /> : null
        }
      />
    </View>
  );
};
