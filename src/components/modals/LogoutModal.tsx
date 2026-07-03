import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { CenteredModal } from 'components/modals/CenteredModal';
import { COLORS, TYPOGRAPHY } from 'theme';

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

interface Props {
  isVisible: boolean;
  onCancelButtonPress: () => void;
  onLogoutButtonPress: () => void;
}

const DeleteModal = ({
  isVisible,
  onCancelButtonPress,
  onLogoutButtonPress,
}: Props): React.ReactElement => (
  <CenteredModal
    header={<Text style={styles.titleText}>Logout</Text>}
    isVisible={isVisible}
    onHideModal={onCancelButtonPress}
  >
    <View>
      <Text style={styles.messageText}>Are you sure you want to logout?</Text>
    </View>
    <View style={styles.buttonsContainer}>
      <Button
        backgroundColor={COLORS.secondary}
        color={COLORS.secondary}
        onPress={onLogoutButtonPress}
        title="logout"
        type="clear"
        icon={{
          color: COLORS.secondary,
          name: 'logout',
          type: 'material-design',
        }}
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

export { DeleteModal };
