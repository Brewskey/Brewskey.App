// @flow

import type { FriendAddFormValues } from '../FriendAddForm';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import CenteredModal from './CenteredModal';
import FriendAddForm from '../FriendAddForm';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  headerText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textInverse,
  },
  root: {
    width: 250,
  },
});

type Props = {
  isVisible: boolean,
  onFriendAddFormSubmit: (values: FriendAddFormValues) => Promise<void>,
  onHideModal: () => void,
};

@observer
class FriendAddCustomModal extends React.Component<Props> {
  render(): React.Node {
    const { isVisible, onHideModal, onFriendAddFormSubmit } = this.props;

    return (
      <CenteredModal
        header={<Text style={styles.headerText}>Request Friendship</Text>}
        isVisible={isVisible}
        onHideModal={onHideModal}
      >
        <View style={styles.root}>
          <FriendAddForm onSubmit={onFriendAddFormSubmit} />
        </View>
      </CenteredModal>
    );
  }
}

export default FriendAddCustomModal;
