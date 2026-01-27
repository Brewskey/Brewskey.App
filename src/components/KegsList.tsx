import * as React from 'react';

import { BeverageAvatar } from '../common/avatars/BeverageAvatar';
import { List } from '../common/List';
import { ListEmpty } from '../common/ListEmpty';
import { ListItem } from '../common/ListItem';
import { LoadingListFooter } from '../common/LoadingListFooter';
import { KegModal } from './modals/KegModal';
import { useGetKegs } from '../hooks/queries/KegQueries';

import type { EntityID, Keg, QueryOptions } from '@brewskey/js-api';
import type { ListRenderItemInfo } from 'react-native';

import type { ListComponentTypes } from '../common/List';

interface Props {
  ListHeaderComponent?: ListComponentTypes;
  onRefresh?: () => void | Promise<void>;
  queryOptions?: QueryOptions;
}

const LoadedRow = ({
  item: keg,
  onPress,
}: {
  item: Keg;
  onPress: (item: Keg) => void;
}): React.ReactElement => (
  <ListItem
    chevron={false}
    item={keg}
    leftAvatar={<BeverageAvatar beverageId={keg.beverage.id} />}
    onPress={(item: Keg) => onPress(item)}
    testID={`keg-item-${keg.id}`}
    title={keg.beverage.name}
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
  const [selectedKegId, setSelectedKegId] = React.useState<EntityID | null>(
    null,
  );

  const _keyExtractor = (row: Keg): string => row.id.toString();

  const _onRefresh = () => {
    onRefresh?.();
    kegs.refetch();
  };

  const _renderRow = ({
    item,
  }: ListRenderItemInfo<Keg>): React.ReactElement => (
    <LoadedRow
      item={item}
      onPress={(keg: Keg) => {
        setSelectedKegId(keg.id);
      }}
    />
  );

  const { isLoading } = kegs;
  return (
    <React.Fragment>
      <List
        data={kegs.data}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={!isLoading ? <ListEmpty message="No kegs" /> : null}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        listType="flatList"
        onEndReached={kegs.fetchNextPage}
        onRefresh={_onRefresh}
        renderItem={_renderRow}
      />
      <KegModal kegID={selectedKegId} onClose={() => setSelectedKegId(null)} />
    </React.Fragment>
  );
};

export { KegsList };
