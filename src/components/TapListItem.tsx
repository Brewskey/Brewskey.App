import * as React from 'react';

import { Text } from 'react-native';

import { BeverageAvatar } from 'common/avatars/BeverageAvatar';
import { ListItem } from 'common/ListItem';
import { COLORS } from 'theme';
import { calculateKegLevel } from 'utils';

import type { Tap } from '@brewskey/js-api';

interface Props {
  index: number;
  onPress?: (arg1: Tap) => void;
  tap: Tap;
}

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
      chevron={false}
      item={tap}
      leftAvatar={<BeverageAvatar beverageId={beverage ? beverage.id : ''} />}
      onPress={onPress}
      subtitle={<Text>{description || ''}</Text>}
      testID={`tap-item-${tap.id}`}
      title={<Text>{`${tapNumber} - ${beverageName}`}</Text>}
      badge={
        kegLevel !== null
          ? {
              badgeStyle: { backgroundColor: COLORS.accent },
              value: `${kegLevel}%`,
            }
          : undefined
      }
    />
  );
};

export { TapListItem };
