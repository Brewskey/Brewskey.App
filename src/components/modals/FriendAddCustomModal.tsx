import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { CenteredModal } from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { FriendAddForm } from '../FriendAddForm';

import type { FriendAddFormValues } from '../FriendAddForm';

const styles = StyleSheet.create({
  headerText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textInverse,
  },
  root: {
    width: 250,
  },
});

interface Props {
  isVisible: boolean;
  onFriendAddFormSubmit: (values: FriendAddFormValues) => Promise<void>;
  onHideModal: () => void;
}

const FriendAddCustomModal: React.FC<Props> = ({
  isVisible,
  onHideModal,
  onFriendAddFormSubmit,
}) => (
  <CenteredModal
    header={<Text style={styles.headerText}>Request Friendship</Text>}
    isVisible={isVisible}
    onHideModal={onHideModal}
  >
    <View style={styles.root}>
      <FriendAddForm onSubmit={onFriendAddFormSubmit} />
    </View>
  </CenteredModal>
);

export { FriendAddCustomModal };
