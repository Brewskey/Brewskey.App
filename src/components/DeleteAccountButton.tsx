import * as React from 'react';
import { useState } from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet, Text } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Fragment } from 'common/Fragment';
import { DeleteModal } from 'components/modals/DeleteModal';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeleteAccount } from 'hooks/queries/AuthQueries';
import { COLORS, TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  button: {
    borderColor: COLORS.danger,
    borderWidth: 1,
    marginHorizontal: 0,
  },
  messageText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  messageTextBold: {
    fontWeight: 'bold',
  },
});

const deleteAccountMessage = (
  <Text
    style={styles.messageText}
    testID="delete-account-confirmation-modal-message"
  >
    This permanently deletes your Brewskey account, removes your profile,
    friends, and personal info, and{' '}
    <Text style={styles.messageTextBold}>cannot be undone</Text>. Your past
    pours on shared taps will remain visible but show as anonymous.
  </Text>
);

const DeleteAccountButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const addSnackBarMessage = useAddSnackBarMessage();
  const deleteAccountMutation = useDeleteAccount();

  const onDeleteConfirm = async () => {
    setIsModalVisible(false);
    try {
      await deleteAccountMutation.mutateAsync();
      addSnackBarMessage({ content: 'Your account has been deleted.' });
    } catch {
      addSnackBarMessage({
        content:
          "We couldn't delete your account. Please try again, or contact support if the problem continues.",
      });
    }
  };

  return (
    <Fragment>
      <Button
        backgroundColor={COLORS.secondary}
        color={COLORS.danger}
        icon={
          <Icon
            color={COLORS.danger}
            name="delete"
            size={20}
            type="material-community"
          />
        }
        iconPosition="left"
        loading={deleteAccountMutation.isPending}
        onPress={() => {
          if (!deleteAccountMutation.isPending) {
            setIsModalVisible(true);
          }
        }}
        style={styles.button}
        testID="settings-delete-account-button"
        title="Delete account"
      />
      <DeleteModal
        deleteButtonTitle="delete"
        isVisible={isModalVisible}
        message={deleteAccountMessage}
        onCancelButtonPress={() => setIsModalVisible(false)}
        onDeleteButtonPress={onDeleteConfirm}
        testID="delete-account-confirmation-modal"
        title="Delete account"
      />
    </Fragment>
  );
};

export { DeleteAccountButton };
