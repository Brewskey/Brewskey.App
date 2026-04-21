import * as React from 'react';

import { Platform, StyleSheet, Text, View } from 'react-native';

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
  deleteButtonTitle?: string;
  isVisible: boolean;
  message: string;
  onCancelButtonPress: () => void;
  onDeleteButtonPress: () => void;
  testID?: string;
  title: string;
}

const DeleteModal = ({
  deleteButtonTitle = 'delete',
  isVisible,
  message,
  onCancelButtonPress,
  onDeleteButtonPress,
  testID,
  title,
}: Props): React.ReactElement => (
  // RNE icon objects inside Button render an additional interactive element on web,
  // which can nest a <button> inside the button and break hydration.
  <CenteredModal
    isVisible={isVisible}
    onHideModal={onCancelButtonPress}
    testID={testID}
    header={
      <Text style={styles.titleText} testID={`${testID}-title`}>
        {title}
      </Text>
    }
  >
    <View>
      <Text style={styles.messageText} testID={`${testID}-message`}>
        {message}
      </Text>
    </View>
    <View style={styles.buttonsContainer}>
      <Button
        backgroundColor={COLORS.secondary}
        color={COLORS.danger}
        icon={
          Platform.OS !== 'web'
            ? { color: COLORS.danger, name: 'delete' }
            : undefined
        }
        onPress={onDeleteButtonPress}
        testID={`${testID}-button-delete`}
        title={deleteButtonTitle}
      />
      <Button
        backgroundColor={COLORS.secondary}
        color={COLORS.text}
        icon={
          Platform.OS !== 'web'
            ? { color: COLORS.text, name: 'close' }
            : undefined
        }
        onPress={onCancelButtonPress}
        testID={`${testID}-button-cancel`}
        title="cancel"
      />
    </View>
  </CenteredModal>
);

export { DeleteModal };
