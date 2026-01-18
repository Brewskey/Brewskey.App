import type { Account } from '@brewskey/js-api';

import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../../common/buttons/Button';
import Fragment from '../../common/Fragment';
import CenteredModal from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';
import DeleteModal from './DeleteModal';

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
  account: Account;
  isVisible: boolean;
  onFriendDeletePress: () => Promise<void>;
  onHideModal: () => void;
};

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
        isVisible={isVisible && !isDeleteModalVisible}
        onHideModal={onHideModal}
      >
        <View style={styles.root}>
          <Text style={styles.messageText}>
            You're friends with {account.userName}
          </Text>
          <Button secondary title="okay" onPress={onHideModal} />
          <Button
            title="remove friend"
            onPress={() => setIsDeleteModalVisible(true)}
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

export default FriendApprovedModal;
