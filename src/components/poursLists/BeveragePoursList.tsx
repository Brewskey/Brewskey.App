import type { QueryOptions, Pour } from '@brewskey/js-api';

import * as React from 'react';
import moment from 'moment';
import ListItem from '../../common/ListItem';
import ListEmpty from '../../common/ListEmpty';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import BasePoursList from './BasePoursList';
import PintCounter from '../PintCounter';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { ListComponentTypes } from '../../common/List';

type Props = {
  ListHeaderComponent?: ListComponentTypes;
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
  testID?: string;
};

const LoadedRow: React.FC<{
  value: Pour;
  onItemPress: (pour: Pour) => void;
}> = ({ value: pour, onItemPress }) => (
  <ListItem
    leftAvatar={
      <BeverageAvatar beverageId={pour.beverage ? pour.beverage.id : ''} />
    }
    item={pour}
    rightIcon={
      <PintCounter beverageID={pour?.beverage?.id} ounces={pour.ounces} />
    }
    title={`${
      pour.beverage ? pour.beverage.name : NULL_STRING_PLACEHOLDER
    } – ${pour.ounces.toFixed(1)} oz`}
    subtitle={moment(pour.pourDate).fromNow()}
    onPress={() => onItemPress(pour)}
  />
);

const BeveragePoursList = ({
  ListHeaderComponent,
  onRefresh,
  queryOptions,
  testID,
}: Props): React.ReactElement => (
  <BasePoursList
    ListEmptyComponent={<ListEmpty message="No recent pours" />}
    ListHeaderComponent={ListHeaderComponent}
    loadedRow={LoadedRow}
    onRefresh={onRefresh}
    queryOptions={queryOptions}
    testID={testID}
  />
);

export default BeveragePoursList;
