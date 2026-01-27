import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { CenteredModal } from './CenteredModal';
import { DeleteModal } from './DeleteModal';
import { Button } from '../../common/buttons/Button';
import { Fragment } from '../../common/Fragment';
import { COLORS, TYPOGRAPHY } from '../../theme';

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
  account: Account;
  isVisible: boolean;
  onFriendDeletePress: () => Promise<void>;
  onHideModal: () => void;
}

const FriendApprovedModal: React.FC<Props> = ({
  account,
  isVisible,
  onFriendDeletePress,
  onHideModal,
}) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onFriendDeletePressHandler = () => {
    setIsDeleteModalVisible(false);
    onFriendDeletePress();
  };

  return (
    <Fragment>
      <CenteredModal
        header={<Text style={styles.headerText}>You are friends!</Text>}
        isVisible={isVisible ? !isDeleteModalVisible : false}
        onHideModal={onHideModal}
      >
        <View style={styles.root}>
          <Text style={styles.messageText}>
            You're friends with {account.userName}
          </Text>
          <Button secondary onPress={onHideModal} title="okay" />
          <Button
            onPress={() => setIsDeleteModalVisible(true)}
            title="remove friend"
          />
        </View>
      </CenteredModal>
      <DeleteModal
        isVisible={isDeleteModalVisible}
        message={`Are you sure you want to delete ${account.userName} from friends?`}
        onCancelButtonPress={() => setIsDeleteModalVisible(false)}
        onDeleteButtonPress={onFriendDeletePressHandler}
        title="Remove friend"
      />
    </Fragment>
  );
};

export { FriendApprovedModal };
