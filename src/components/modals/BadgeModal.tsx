import * as React from 'react';

import { StyleSheet, Text } from 'react-native';

import { CenteredModal } from 'components/modals/CenteredModal';
import { BADGE_BY_TYPE } from 'badges';
import { Button } from 'common/buttons/Button';
import { COLORS, TYPOGRAPHY } from 'theme';
import { BadgeIcon } from 'components/BadgeIcon';

import type { AchievementCounter } from '@brewskey/js-api';

const styles = StyleSheet.create({
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textInverse,
    paddingVertical: 8,
    textAlign: 'center',
    width: 200,
  },
  headerText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textInverse,
  },
  modalContentContainer: {
    alignItems: 'center',
  },
});

interface Props {
  achievementCounter: AchievementCounter | null | undefined;
  isVisible: boolean;
  onHideModal: () => void;
}

// todo add swiper
export const BadgeModal = ({
  achievementCounter,
  isVisible,
  onHideModal,
}: Props): React.ReactElement | null => {
  if (!achievementCounter) {
    return null;
  }

  const { achievementType, total } = achievementCounter;
  const { description, name } = BADGE_BY_TYPE[achievementType];

  return (
    <CenteredModal
      contentContainerStyle={styles.modalContentContainer}
      header={<Text style={styles.headerText}>{name}</Text>}
      isVisible={isVisible}
      onHideModal={onHideModal}
    >
      <BadgeIcon achievementType={achievementType} count={total} size="large" />
      <Text style={styles.descriptionText}>{description}</Text>
      <Button secondary onPress={onHideModal} title="okay" />
    </CenteredModal>
  );
};
