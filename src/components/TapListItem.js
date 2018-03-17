// @flow

import type { Tap } from 'brewskey.js-api';

import * as React from 'react';
import ListItem from '../common/ListItem';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import { calculateKegLevel } from '../utils';
import { COLORS } from '../theme';

type Props = {|
  index: number,
  onPress?: () => void,
  tap: Tap,
|};

const TapListItem = ({ index, onPress, tap }: Props) => {
  const { currentKeg, description } = tap;
  const beverage = currentKeg ? currentKeg.beverage : null;
  const beverageName = beverage ? beverage.name : 'No Beer on Tap';
  const kegLevel = currentKeg
    ? calculateKegLevel(currentKeg.ounces, currentKeg.maxOunces)
    : null;

  return (
    <ListItem
      badge={
        kegLevel !== null
          ? {
              containerStyle: { backgroundColor: COLORS.accent },
              value: `${kegLevel}%`,
            }
          : null
      }
      avatar={<BeverageAvatar beverageId={beverage ? beverage.id : ''} />}
      hideChevron
      item={tap}
      onPress={onPress}
      title={`${index + 1} - ${beverageName}`}
      subtitle={description || ''}
    />
  );
};

export default TapListItem;
