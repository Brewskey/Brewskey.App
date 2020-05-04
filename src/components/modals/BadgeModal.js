// @flow

import type { AchievementCounter } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';
import BADGE_BY_ACHIEVEMENT_TYPE from '../../badges';
import BadgeIcon from '../BadgeIcon';
import Button from '../../common/buttons/Button';
import CenteredModal from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';

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

type Props = {|
  achievementCounter: ?AchievementCounter,
  isVisible: boolean,
  onHideModal: () => void,
|};

// todo add swiper
const BadgeModal = ({
  achievementCounter,
  isVisible,
  onHideModal,
}: Props): React.Node => {
  if (!achievementCounter) {
    return null;
  }

  const { achievementType, total } = achievementCounter;
  const { description, name } = BADGE_BY_ACHIEVEMENT_TYPE[achievementType];

  return (
    <CenteredModal
      contentContainerStyle={styles.modalContentContainer}
      header={<Text style={styles.headerText}>{name}</Text>}
      isVisible={isVisible}
      onHideModal={onHideModal}
    >
      <BadgeIcon achievementType={achievementType} count={total} size="large" />
      <Text style={styles.descriptionText}>{description}</Text>
      <Button secondary title="okay" onPress={onHideModal} />
    </CenteredModal>
  );
};

export default (observer(BadgeModal): typeof BadgeModal);
