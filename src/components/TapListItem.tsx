import type { Tap } from '@brewskey/js-api';

import * as React from 'react';
import { Text } from 'react-native';
import ListItem from '../common/ListItem';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import { calculateKegLevel } from '../utils';
import { COLORS } from '../theme';

type Props = {
  index: number;
  onPress?: (arg1: Tap) => void;
  tap: Tap;
};

const TapListItem = ({ onPress, tap }: Props): React.ReactElement => {
  const { currentKeg, description, tapNumber } = tap;
  const beverage = currentKeg ? currentKeg.beverage : null;
  const beverageName = beverage ? beverage.name : 'No Beer on Tap';
  const kegLevel = currentKeg
    ? calculateKegLevel({
        kegType: currentKeg.kegType,
        maxOunces: currentKeg.maxOunces,
        ounces: currentKeg.ounces,
      }).toFixed(0)
    : null;

  return (
    <ListItem
      badge={
        kegLevel !== null
          ? {
              badgeStyle: { backgroundColor: COLORS.accent },
              value: `${kegLevel}%`,
            }
          : undefined
      }
      leftAvatar={<BeverageAvatar beverageId={beverage ? beverage.id : ''} />}
      chevron={false}
      item={tap}
      onPress={onPress}
      title={<Text>{`${tapNumber} - ${beverageName}`}</Text>}
      subtitle={<Text>{description || ''}</Text>}
    />
  );
};

export default TapListItem;
