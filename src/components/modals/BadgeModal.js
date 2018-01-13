// @flow

import type { Badge } from '../../badges';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
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
  badge: ?Badge,
  isVisible: boolean,
  onHideModal: () => void,
|};

// todo add swiper
const BadgeModal = ({ badge, isVisible, onHideModal }: Props) => {
  if (!badge) {
    return null;
  }

  const { description, name } = badge;
  return (
    <CenteredModal
      contentContainerStyle={styles.modalContentContainer}
      header={<Text style={styles.headerText}>{name}</Text>}
      isVisible={isVisible}
      onHideModal={onHideModal}
    >
      <BadgeIcon badge={badge} size="large" />
      <Text style={styles.descriptionText}>{description}</Text>
      <Button title="okay" onPress={onHideModal} />
    </CenteredModal>
  );
};

export default BadgeModal;
