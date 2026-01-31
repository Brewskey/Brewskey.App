import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { CenteredModal } from 'components/modals/CenteredModal';
import { Button } from 'common/buttons/Button';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { Account } from '@brewskey/js-api';

const styles = StyleSheet.create({
  buttonStyle: { width: 100 },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
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
  userNameText: {
    fontWeight: 'bold',
  },
});

interface Props {
  account: Account;
  isVisible: boolean;
  onFriendAddPress: () => Promise<void>;
  onHideModal: () => void;
}

const FriendAddModal: React.FC<Props> = ({
  account,
  isVisible,
  onHideModal,
  onFriendAddPress,
}) => (
  <CenteredModal
    header={<Text style={styles.headerText}>Request friendship!</Text>}
    isVisible={isVisible}
    onHideModal={onHideModal}
  >
    <View style={styles.root}>
      <Text style={styles.messageText}>
        Do you want to add{' '}
        <Text style={styles.userNameText}>{account.userName}</Text> to your
        friends?
      </Text>
      <View style={styles.buttonsContainer}>
        <Button
          buttonStyle={styles.buttonStyle}
          onPress={onHideModal}
          title="no"
        />
        <Button
          secondary
          buttonStyle={styles.buttonStyle}
          onPress={onFriendAddPress}
          title="yes"
        />
      </View>
    </View>
  </CenteredModal>
);

export { FriendAddModal };
