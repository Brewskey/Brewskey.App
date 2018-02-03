// @flow

import type { Tap } from 'brewskey.js-api';

import * as React from 'react';
import ListItem from '../common/ListItem';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import { COLORS } from '../theme';

type Props = {|
  index: number,
  onPress?: () => void,
  tap: Tap,
|};

const TapListItem = ({ index, onPress, tap }: Props) => {
  const { currentKeg } = tap;
  const beverage = currentKeg ? currentKeg.beverage : null;
  const beverageName = beverage ? beverage.name : 'No Beer on Tap';
  const beverageLevel = currentKeg
    ? (currentKeg.maxOunces - currentKeg.ounces) / currentKeg.maxOunces * 100
    : null;

  return (
    <ListItem
      badge={
        beverageLevel
          ? {
              containerStyle: { backgroundColor: COLORS.accent },
              value: `${beverageLevel.toFixed(0)}%`,
            }
          : null
      }
      avatar={<BeverageAvatar beverageId={beverage ? beverage.id : ''} />}
      hideChevron
      item={tap}
      onPress={onPress}
      title={`${index + 1} - ${beverageName}`}
    />
  );
};

export default TapListItem;
