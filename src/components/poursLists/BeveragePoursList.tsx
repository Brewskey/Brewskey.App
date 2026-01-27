import * as React from 'react';

import moment from 'moment';

import { BasePoursList } from './BasePoursList';
import { BeverageAvatar } from '../../common/avatars/BeverageAvatar';
import { ListEmpty } from '../../common/ListEmpty';
import { ListItem } from '../../common/ListItem';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { PintCounter } from '../PintCounter';

import type { Pour, QueryOptions } from '@brewskey/js-api';

import type { ListComponentTypes } from '../../common/List';

interface Props {
  ListHeaderComponent?: ListComponentTypes;
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
  testID?: string;
}

const LoadedRow: React.FC<{
  value: Pour;
  onItemPress: (pour: Pour) => void;
}> = ({ value: pour, onItemPress }) => (
  <ListItem
    item={pour}
    onPress={() => onItemPress(pour)}
    subtitle={moment(pour.pourDate).fromNow()}
    testID={`pour-item-${pour.id}`}
    leftAvatar={
      <BeverageAvatar beverageId={pour.beverage ? pour.beverage.id : ''} />
    }
    rightIcon={
      <PintCounter beverageID={pour?.beverage?.id} ounces={pour.ounces} />
    }
    title={`${
      pour.beverage ? pour.beverage.name : NULL_STRING_PLACEHOLDER
    } – ${pour.ounces.toFixed(1)} oz`}
  />
);

const BeveragePoursList = ({
  ListHeaderComponent,
  onRefresh,
  queryOptions,
  testID,
}: Props): React.ReactElement => (
  <BasePoursList
    usePourModal
    ListEmptyComponent={<ListEmpty message="No recent pours" />}
    ListHeaderComponent={ListHeaderComponent}
    loadedRow={LoadedRow}
    onRefresh={onRefresh}
    queryOptions={queryOptions}
    testID={testID}
  />
);

export { BeveragePoursList };
