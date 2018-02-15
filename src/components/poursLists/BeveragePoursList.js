// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';
import type { RowItemProps } from '../../common/SwipeableRow';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import ListItem from '../../common/ListItem';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import BasePoursList from './BasePoursList';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  queryOptions?: QueryOptions,
|};

const BeveragePoursList = observer(
  ({ ListHeaderComponent, queryOptions }: Props) => (
    <BasePoursList
      ListHeaderComponent={ListHeaderComponent}
      loadedRow={LoadedRow}
      queryOptions={queryOptions}
    />
  ),
);

const LoadedRow = ({ item: pour }: RowItemProps<Pour, *>) => (
  <ListItem
    avatar={
      <BeverageAvatar beverageId={pour.beverage ? pour.beverage.id : ''} />
    }
    hideChevron
    item={pour}
    title={`${
      pour.beverage ? pour.beverage.name : NULL_STRING_PLACEHOLDER
    } – ${pour.ounces.toFixed(1)} oz`}
    subtitle={moment(pour.pourDate).fromNow()}
  />
);

export default BeveragePoursList;
