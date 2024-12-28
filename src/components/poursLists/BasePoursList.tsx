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
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
};

export const BasePoursList = ({
  ListEmptyComponent,
  ListHeaderComponent,
  loadedRow: LoadedRow,
  queryOptions = {},
  onRefresh,
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
  }: ListRenderItemInfo<Pour>): React.ReactElement => (
    <LoadedRow
      value={item}
      onItemPress={() =>
        setSelectedBeverageId(
          nullthrows(item.beverage, 'beverage is undefined').id,
        )
      }
    />
  );
  return (
    <>
      <List
        data={pours.data}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<LoadingListFooter isLoading={pours.isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={pours.fetchNextPage}
        onRefresh={onRefreshList}
        renderItem={renderRow}
      />
      <BeverageModal ref={beverageModal} beverageID={selectedBeverageId} />
    </>
  );
};

export default BasePoursList;
