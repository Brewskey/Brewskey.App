import * as React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BADGE_BY_ACHIEVEMENT_TYPE, { BADGE_IMAGE_SIZES } from '../badges';
import { COLORS } from '../theme';

import type { AchievementType } from '@brewskey/js-api';

const styles = StyleSheet.create({
  counterContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    position: 'absolute',
  },
  counterContainerLarge: {
    minWidth: 30,
    padding: 5,
    right: 8,
    top: 8,
  },
  counterContainerSmall: {
    minWidth: 20,
    padding: 3,
    right: 0,
    top: 0,
  },
  counterText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counterTextLarge: {
    fontSize: 14,
  },
  counterTextSmall: {
    fontSize: 10,
  },
});

type SizeType = 'large' | 'small';
interface Props {
  achievementType: AchievementType;
  count?: number;
  onPress?: (achievementCounter: AchievementType) => void;
  size: SizeType;
}

const BadgeIcon: React.FC<Props> = ({
  achievementType,
  count,
  onPress,
  size = 'small',
}) => {
  const handlePress = () => onPress?.(achievementType);

  const badge = BADGE_BY_ACHIEVEMENT_TYPE[achievementType];
  const isLarge = size === 'large';

  return (
    <TouchableOpacity disabled={!onPress} onPress={handlePress}>
      <Image
        source={badge.image[size]}
        style={{
          height: BADGE_IMAGE_SIZES[size],
          width: BADGE_IMAGE_SIZES[size],
        }}
      />
      {count ? (
        <View
          style={[
            styles.counterContainer,
            isLarge
              ? styles.counterContainerLarge
              : styles.counterContainerSmall,
          ]}
        >
          <Text
            style={[
              styles.counterText,
              isLarge ? styles.counterTextLarge : styles.counterTextSmall,
            ]}
          >
            x{count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default React.memo(BadgeIcon);
