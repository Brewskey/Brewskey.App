// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    paddingVertical: 25,
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

type Props = {|
  isVisible: boolean,
  message: string,
  onCancelButtonPress: () => void,
  onDeleteButtonPress: () => void,
|};

const DeleteModal = ({
  isVisible,
  message,
  onCancelButtonPress,
  onDeleteButtonPress,
}: Props) => (
  <Modal
    isVisible={isVisible}
    onBackButtonPress={onCancelButtonPress}
    onBackdropPress={onCancelButtonPress}
    useNativeDriver
  >
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Button onPress={onCancelButtonPress} title="cancel" />
      <Button onPress={onDeleteButtonPress} title="delete" />
    </View>
  </Modal>
);

export default DeleteModal;
