// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';
import type { RowItemProps } from '../../common/SwipeableRow';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import ListItem from '../../common/ListItem';
import ListEmpty from '../../common/ListEmpty';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import BasePoursList from './BasePoursList';
import PintCounter from '../PintCounter';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  onRefresh?: () => void,
  queryOptions?: QueryOptions,
|};

const BeveragePoursList = observer(
  ({ ListHeaderComponent, onRefresh, queryOptions }: Props): React.Node => (
    <BasePoursList
      ListEmptyComponent={<ListEmpty message="No recent pours" />}
      ListHeaderComponent={ListHeaderComponent}
      loadedRow={LoadedRow}
      onRefresh={onRefresh}
      queryOptions={queryOptions}
    />
  ),
);

const LoadedRow = ({ item: pour }: RowItemProps<Pour, *>): React.Node => (
  <ListItem
    avatar={
      <BeverageAvatar beverageId={pour.beverage ? pour.beverage.id : ''} />
    }
    item={pour}
    rightIcon={<PintCounter ounces={pour.ounces} />}
    title={`${
      pour.beverage ? pour.beverage.name : NULL_STRING_PLACEHOLDER
    } – ${pour.ounces.toFixed(1)} oz`}
    subtitle={moment(pour.pourDate).fromNow()}
  />
);
export default BeveragePoursList;
