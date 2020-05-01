// @flow

import type { Account } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import Button from '../../common/buttons/Button';
import CenteredModal from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';

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

type Props = {
  onHideModal: () => void,
  account: Account,
  isVisible: boolean,
};

@observer
class FriendPendingModal extends React.Component<Props> {
  render() {
    const { account, isVisible, onHideModal } = this.props;

    return (
      <CenteredModal
        header={<Text style={styles.headerText}>Pending friendship</Text>}
        isVisible={isVisible}
        onHideModal={onHideModal}
      >
        <View style={styles.root}>
          <Text style={styles.messageText}>
            You're requested a friendship with {account.userName}. The user
            should accept or decline your request.
          </Text>
          <Button secondary title="okay" onPress={onHideModal} />
        </View>
      </CenteredModal>
    );
  }
}

export default FriendPendingModal;
