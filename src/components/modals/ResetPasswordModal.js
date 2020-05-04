// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../common/buttons/Button';
import CenteredModal from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 300,
  },
  messageText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  titleText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
});

type Props = {|
  isVisible: boolean,
  onHideModal: () => void,
|};

class ResetPasswordModal extends React.PureComponent<Props> {
  render(): React.Node {
    const { isVisible, onHideModal } = this.props;
    return (
      <CenteredModal
        header={<Text style={styles.titleText}>Email sent!</Text>}
        isVisible={isVisible}
        onHideModal={onHideModal}
      >
        <View style={styles.container}>
          <Text style={styles.messageText}>
            We've sent a email to the address you provided with instructions on
            how to reset your password.
          </Text>
          <Button secondary title="OK" onPress={onHideModal} />
        </View>
      </CenteredModal>
    );
  }
}

export default ResetPasswordModal;
