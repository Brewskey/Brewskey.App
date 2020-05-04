// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CenteredModal from './CenteredModal';
import Button from '../../common/buttons/Button';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  onCancelButtonPress: () => void,
  onLogoutButtonPress: () => void,
|};

const DeleteModal = ({
  isVisible,
  onCancelButtonPress,
  onLogoutButtonPress,
}: Props): React.Node => (
  <CenteredModal
    isVisible={isVisible}
    header={<Text style={styles.titleText}>Logout</Text>}
    onHideModal={onCancelButtonPress}
  >
    <View>
      <Text style={styles.messageText}>Are you sure you want to logout?</Text>
    </View>
    <View style={styles.buttonsContainer}>
      <Button
        backgroundColor={COLORS.secondary}
        color={COLORS.secondary}
        icon={{
          color: COLORS.secondary,
          name: 'logout',
          type: 'material-community',
        }}
        onPress={onLogoutButtonPress}
        title="logout"
        transparent
      />
      <Button
        backgroundColor={COLORS.secondary}
        color={COLORS.text}
        icon={{ color: COLORS.text, name: 'close' }}
        onPress={onCancelButtonPress}
        title="cancel"
      />
    </View>
  </CenteredModal>
);

export default DeleteModal;
