import type { EntityID, Keg, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';

import List, { ListComponentTypes } from '../common/List';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import ListItem from '../common/ListItem';
import ListEmpty from '../common/ListEmpty';
import LoadingListFooter from '../common/LoadingListFooter';
import KegModal from '../components/modals/KegModal';
import { useGetKegs } from '../hooks/queries/KegQueries';
import { ListRenderItemInfo } from 'react-native';

type Props = {
  ListHeaderComponent?: ListComponentTypes;
  onRefresh?: () => void | Promise<void>;
  queryOptions?: QueryOptions;
};

const LoadedRow = ({
  item: keg,
  onPress,
}: {
  item: Keg;
  onPress: (item: Keg) => void;
}): React.ReactElement => (
  <ListItem
    leftAvatar={<BeverageAvatar beverageId={keg.beverage.id} />}
    chevron={false}
    item={keg}
    title={keg.beverage.name}
    onPress={(item) => onPress(item!)}
  />
);

const KegsList: React.FC<Props> = ({
  queryOptions = {},
  onRefresh,
  ListHeaderComponent,
}) => {
  const kegs = useGetKegs({
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
    ...queryOptions,
  });
  const [selectedKegId, setSelectedKegId] =
    React.useState<EntityID | null>(null);

  const _keyExtractor = (row: Keg): string => row.id.toString();

  const _onRefresh = () => {
    onRefresh?.();
    kegs.refetch();
  };

  const _renderRow = ({
    item,
  }: ListRenderItemInfo<Keg>): React.ReactElement => {
    return (
      <LoadedRow
        onPress={(keg: Keg) => {
          setSelectedKegId(keg.id);
        }}
        item={item}
      />
    );
  };

  const isLoading = kegs.isLoading;
  return (
    <>
      <List
        data={kegs.data}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={!isLoading ? <ListEmpty message="No kegs" /> : null}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={kegs.fetchNextPage}
        onRefresh={_onRefresh}
        renderItem={_renderRow}
      />
      <KegModal
        kegID={selectedKegId}
        onClose={() => setSelectedKegId(null)}
      />
    </>
  );
};

export default KegsList;
