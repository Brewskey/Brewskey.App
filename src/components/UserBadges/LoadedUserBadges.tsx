import * as React from 'react';

import { ScrollView, View } from 'react-native';

import { BadgeIcon } from 'components/BadgeIcon';
import { BadgeModal } from 'components/modals/BadgeModal';
import { EmptyUserBadges } from 'components/UserBadges/EmptyUserBadges';
import { styles } from 'components/UserBadges/UserBadgesStyles';

import type { AchievementCounter, AchievementType } from '@brewskey/js-api';

interface Props {
  value: { achievementCounter: AchievementCounter[] };
}

export interface LoadedUserBadgesHandle {
  selectAchievementCounterByType: (achievementCounter: AchievementType) => void;
}

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
      <ScrollView horizontal contentContainerStyle={styles.container}>
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
                size="small"
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

export { LoadedUserBadges };
