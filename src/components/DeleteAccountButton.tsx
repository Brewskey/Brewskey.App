import * as React from 'react';
import { useState } from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Fragment } from 'common/Fragment';
import { DeleteModal } from 'components/modals/DeleteModal';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeleteAccount } from 'hooks/queries/AuthQueries';
import { COLORS } from 'theme';

const styles = StyleSheet.create({
  button: {
    borderColor: COLORS.danger,
    borderWidth: 1,
    marginHorizontal: 0,
  },
});

const deleteAccountMessage =
  'Permanently delete your account and remove personal information like your profile, email, phone number, friends, and linked sign-in data. Past pours on shared taps stay visible but become anonymous.';

const DeleteAccountButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const addSnackBarMessage = useAddSnackBarMessage();
  const deleteAccountMutation = useDeleteAccount();

  const onDeleteConfirm = async () => {
    setIsModalVisible(false);
    await deleteAccountMutation.mutateAsync();
    addSnackBarMessage({ content: 'Your account has been deleted.' });
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
        title="Delete Brewskey Account"
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
