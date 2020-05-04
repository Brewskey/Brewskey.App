// @flow

import type { Account } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import Button from '../../common/buttons/Button';
import CenteredModal from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';

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

type Props = {
  account: Account,
  isVisible: boolean,
  onFriendAddPress: () => Promise<void>,
  onHideModal: () => void,
};

@observer
class FriendApprovedModal extends React.Component<Props> {
  render(): React.Node {
    const { account, isVisible, onHideModal, onFriendAddPress } = this.props;

    return (
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
              buttonStyle={styles.buttonStyle}
              onPress={onFriendAddPress}
              secondary
              title="yes"
            />
          </View>
        </View>
      </CenteredModal>
    );
  }
}

export default FriendApprovedModal;
