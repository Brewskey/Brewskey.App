import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { CenteredModal } from 'components/modals/CenteredModal';
import { Button } from 'common/buttons/Button';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { Account } from '@brewskey/js-api';

const styles = StyleSheet.create({
  headerText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textInverse,
  },
  messageText: {
    color: COLORS.textInverse,
    paddingBottom: 12,
    textAlign: 'center',
  },
  root: {
    width: 250,
  },
});

interface Props {
  onHideModal: () => void;
  account: Account;
  isVisible: boolean;
}

const FriendPendingModal: React.FC<Props> = ({
  account,
  isVisible,
  onHideModal,
}) => (
  <CenteredModal
    header={<Text style={styles.headerText}>Pending friendship</Text>}
    isVisible={isVisible}
    onHideModal={onHideModal}
  >
    <View style={styles.root}>
      <Text style={styles.messageText}>
        You're requested a friendship with {account.userName}. The user should
        accept or decline your request.
      </Text>
      <Button secondary onPress={onHideModal} title="okay" />
    </View>
  </CenteredModal>
);

export { FriendPendingModal };
