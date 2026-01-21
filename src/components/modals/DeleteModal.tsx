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

type Props = {
  deleteButtonTitle?: string,
  isVisible: boolean,
  message: string,
  onCancelButtonPress: () => void,
  onDeleteButtonPress: () => void,
  testID?: string,
  title: string
};

const DeleteModal = (
  {
    deleteButtonTitle = 'delete',
    isVisible,
    message,
    onCancelButtonPress,
    onDeleteButtonPress,
    testID,
    title,
  }: Props,
): React.ReactElement => <CenteredModal
  isVisible={isVisible}
  header={<Text style={styles.titleText} testID={`${testID}-title`}>{title}</Text>}
  onHideModal={onCancelButtonPress}
  testID={testID}
>
  <View>
    <Text style={styles.messageText} testID={`${testID}-message`}>{message}</Text>
  </View>
  <View style={styles.buttonsContainer}>
    <Button
      backgroundColor={COLORS.secondary}
      color={COLORS.danger}
      icon={{ color: COLORS.danger, name: 'delete' }}
      onPress={onDeleteButtonPress}
      testID={`${testID}-button-delete`}
      title={deleteButtonTitle}
    />
    <Button
      backgroundColor={COLORS.secondary}
      color={COLORS.text}
      icon={{ color: COLORS.text, name: 'close' }}
      onPress={onCancelButtonPress}
      testID={`${testID}-button-cancel`}
      title="cancel"
    />
  </View>
</CenteredModal>;

export default DeleteModal;
