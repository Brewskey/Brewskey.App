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
  deleteButtonTitle?: string,
  isVisible: boolean,
  message: string,
  onCancelButtonPress: () => void,
  onDeleteButtonPress: () => void,
  title: string,
|};

const DeleteModal = ({
  deleteButtonTitle = 'delete',
  isVisible,
  message,
  onCancelButtonPress,
  onDeleteButtonPress,
  title,
}: Props) => (
  <CenteredModal
    isVisible={isVisible}
    header={<Text style={styles.titleText}>{title}</Text>}
    onHideModal={onCancelButtonPress}
  >
    <View>
      <Text style={styles.messageText}>{message}</Text>
    </View>
    <View style={styles.buttonsContainer}>
      <Button
        color={COLORS.danger}
        icon={{ color: COLORS.danger, name: 'delete' }}
        onPress={onDeleteButtonPress}
        title={deleteButtonTitle}
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
