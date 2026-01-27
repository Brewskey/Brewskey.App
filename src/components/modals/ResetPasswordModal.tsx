import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { CenteredModal } from './CenteredModal';
import { Button } from '../../common/buttons/Button';
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

interface Props {
  isVisible: boolean;
  onHideModal: () => void;
}

const ResetPasswordModalComponent: React.FC<Props> = ({
  isVisible,
  onHideModal,
}) => (
  <CenteredModal
    isVisible={isVisible}
    onHideModal={onHideModal}
    testID="reset-password-success-modal"
    header={
      <Text style={styles.titleText} testID="reset-password-success-title">
        Email sent!
      </Text>
    }
  >
    <View style={styles.container}>
      <Text style={styles.messageText}>
        We've sent a email to the address you provided with instructions on how
        to reset your password.
      </Text>
      <Button
        secondary
        onPress={onHideModal}
        testID="button-reset-password-success-ok"
        title="OK"
      />
    </View>
  </CenteredModal>
);

export const ResetPasswordModal = React.memo(ResetPasswordModalComponent);
