import type { AchievementCounter, AchievementType } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BadgeIcon from '../BadgeIcon';
import EmptyUserBadges from './EmptyUserBadges';
import { BadgeModal } from '../modals/BadgeModal';

export const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
  },
  container: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
  },
});

type Props = {
  value: { achievementCounter: AchievementCounter[] };
};

export type LoadedUserBadgesHandle = {
  selectAchievementCounterByType: (achievementCounter: AchievementType) => void;
};

const LoadedUserBadges = React.forwardRef<LoadedUserBadgesHandle, Props>(
  ({ value }, ref) => {
    const [selectedCounter, setSelectedCounter] =
      React.useState<AchievementCounter | null>(null);

    const selectAchievementCounterByType = (
      achievementType: AchievementType,
    ): void => {
      const counter = value.achievementCounter.find(
        (achievementCounter: AchievementCounter): boolean =>
          achievementCounter.achievementType === achievementType,
      );

      if (counter != null) {
        setSelectedCounter(counter);
      }
    };

    React.useImperativeHandle(ref, () => ({
      selectAchievementCounterByType,
    }));

    if (value.achievementCounter.length === 0) {
      return <EmptyUserBadges />;
    }
    return (
      <ScrollView contentContainerStyle={styles.container} horizontal>
        {value.achievementCounter.map(
          ({
            achievementType,
            total,
          }: AchievementCounter): React.ReactElement => (
            <View key={achievementType} style={styles.badgeContainer}>
              <BadgeIcon
                achievementType={achievementType}
                count={total}
                onPress={selectAchievementCounterByType}
              />
            </View>
          ),
        )}
        <BadgeModal
          achievementCounter={selectedCounter}
          isVisible={selectedCounter != null}
          onHideModal={() => {
            setSelectedCounter(null);
          }}
        />
      </ScrollView>
    );
  },
);

export default LoadedUserBadges;
