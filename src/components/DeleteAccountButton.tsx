import * as React from 'react';
import { useState } from 'react';

import { Icon } from '@rneui/themed';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fragment } from 'common/Fragment';
import { DeleteModal } from 'components/modals/DeleteModal';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeleteAccount } from 'hooks/queries/AuthQueries';
import { COLORS } from 'theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  iconContainer: {
    marginRight: 20,
  },
  text: {
    color: COLORS.danger,
    fontSize: 16,
  },
});

const deleteAccountMessage =
  'This permanently deletes your Brewskey account, removes your profile, friends, and personal info, and cannot be undone. Your past pours on shared taps will remain visible but show as anonymous.';

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
      <Pressable
        disabled={deleteAccountMutation.isPending}
        onPress={() => setIsModalVisible(true)}
        style={styles.button}
        testID="settings-delete-account-button"
      >
        <View style={[styles.iconContainer, { pointerEvents: 'none' }]}>
          <Icon
            color={COLORS.danger}
            name="delete"
            size={20}
            type="material-community"
          />
        </View>
        <Text style={styles.text}>Delete account</Text>
      </Pressable>
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
