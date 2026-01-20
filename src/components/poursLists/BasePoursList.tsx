import { EntityID, type Pour, type QueryOptions } from '@brewskey/js-api';

import * as React from 'react';

import LoadingListFooter from '../../common/LoadingListFooter';
import BeverageModal, { BeverageModalHandle } from '../modals/BeverageModal';
import nullthrows from 'nullthrows';
import { useGetPours } from '../../hooks/queries/PourQueries';
import List, { ListComponentTypes } from '../../common/List';
import { ListRenderItemInfo } from 'react-native';

type Props = {
  ListEmptyComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  loadedRow: React.ComponentType<{
    value: Pour;
    onItemPress: (pour: Pour) => void;
  }>;
  onDeleteItemPress?: (item: Pour) => Promise<void>;
  onItemPress?: (pour: Pour) => void; // Optional custom onItemPress handler
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
  rowItemComponent?: React.ComponentType<{
    item: Pour;
    onItemPress: (pour: Pour) => void;
    slideoutComponent: React.ReactNode;
  }>;
  slideoutComponent?: React.ComponentType<{
    item: Pour;
    onDeleteItemPress: (item: Pour) => Promise<void>;
  }>;
  testID?: string;
};

export const BasePoursList = ({
  ListEmptyComponent,
  ListHeaderComponent,
  loadedRow: LoadedRow,
  queryOptions = {},
  onRefresh,
  onDeleteItemPress,
  onItemPress: customOnItemPress,
  rowItemComponent: RowItemComponent,
  slideoutComponent: SlideoutComponent,
  testID,
}: Props) => {
  const beverageModal = React.useRef<BeverageModalHandle>(null);
  const keyExtractor = (row: Pour): string => row.id.toString();
  const pours = useGetPours(queryOptions);
  const [selectedBeverageId, setSelectedBeverageId] =
    React.useState<EntityID | null>(null);

  const onRefreshList = () => {
    onRefresh?.();
    pours.refetch();
  };

  const renderRow = ({
    item,
  }: ListRenderItemInfo<Pour>): React.ReactElement => {
    // Use custom onItemPress if provided, otherwise default to beverage modal
    const onItemPress = customOnItemPress || (() =>
      setSelectedBeverageId(
        nullthrows(item.beverage, 'beverage is undefined').id,
      ));

    // If swipeable functionality is provided, use RowItemComponent
    // RowItemComponent should render ListItem with swipeable props
    if (onDeleteItemPress && SlideoutComponent && RowItemComponent) {
      return (
        <RowItemComponent
          item={item}
          onItemPress={onItemPress}
          slideoutComponent={<SlideoutComponent item={item} onDeleteItemPress={onDeleteItemPress} />}
        />
      );
    }

    // Otherwise use the standard LoadedRow
    return (
      <LoadedRow
        value={item}
        onItemPress={onItemPress}
      />
    );
  };

  return (
    <>
      <List
        data={pours.data}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<LoadingListFooter isLoading={pours.isFetchingNextPage || pours.isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={() => {
          if (pours.hasNextPage) {
            pours.fetchNextPage();
          }
        }}
        onRefresh={onRefreshList}
        renderItem={renderRow}
        testID={testID}
      />
      <BeverageModal ref={beverageModal} beverageID={selectedBeverageId} />
    </>
  );
};

export default BasePoursList;
