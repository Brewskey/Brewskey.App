// @flow

import type { Account } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import Button from '../../common/buttons/Button';
import Fragment from '../../common/Fragment';
import CenteredModal from './CenteredModal';
import { COLORS, TYPOGRAPHY } from '../../theme';
import DeleteModal from './DeleteModal';
import ToggleStore from '../../stores/ToggleStore';

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
  account: Account,
  isVisible: boolean,
  onFriendDeletePress: () => Promise<void>,
  onHideModal: () => void,
};

@observer
class FriendApprovedModal extends React.Component<Props> {
  _deleteModalToggleStore = new ToggleStore();

  _onFriendDeletePress = () => {
    this._deleteModalToggleStore.toggleOff();
    this.props.onFriendDeletePress();
  };

  render(): React.Node {
    const { account, isVisible, onHideModal } = this.props;
    const { isToggled } = this._deleteModalToggleStore;

    return (
      <Fragment>
        <CenteredModal
          header={<Text style={styles.headerText}>You are friends!</Text>}
          isVisible={isVisible && !isToggled}
          onHideModal={onHideModal}
        >
          <View style={styles.root}>
            <Text style={styles.messageText}>
              You're friends with {account.userName}
            </Text>
            <Button secondary title="okay" onPress={onHideModal} />
            <Button
              title="remove friend"
              onPress={this._deleteModalToggleStore.toggleOn}
            />
          </View>
        </CenteredModal>
        <DeleteModal
          isVisible={isToggled}
          message={`Are you sure you want to delete ${account.userName} from friends?`}
          onCancelButtonPress={this._deleteModalToggleStore.toggleOff}
          onDeleteButtonPress={this._onFriendDeletePress}
          title="Remove friend"
        />
      </Fragment>
    );
  }
}

export default FriendApprovedModal;
