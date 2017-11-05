// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

const Container = styled.View`
  background-color: white;
  justify-content: center;
  padding-bottom: 25;
  padding-top: 25;
`;

const Message = styled.Text`
  align-items: center;
  margin-bottom: 20;
  text-align: center;
`;

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
}: Props): React.Node => (
  <Modal
    isVisible={isVisible}
    onBackButtonPress={onCancelButtonPress}
    onBackdropPress={onCancelButtonPress}
    useNativeDriver
  >
    <Container>
      <Message>{message}</Message>
      <Button onPress={onCancelButtonPress} title="cancel" />
      <Button onPress={onDeleteButtonPress} title="delete" />
    </Container>
  </Modal>
);

export default DeleteModal;
