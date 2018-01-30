// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import SwipeableActionButton from '../SwipeableActionButton';
import DeleteModal from './DeleteModal';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderColor: COLORS.secondary3,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButtonContainer: {
    backgroundColor: COLORS.danger,
  },
  deleteIcon: {
    color: COLORS.textInverse,
  },
  editButtonContainer: {
    backgroundColor: COLORS.accent,
  },
  editIcon: {
    color: COLORS.textInverse,
  },
});

type Props<TItem> = {|
  deleteModalMessage: string,
  item: TItem,
  onDeleteItemPress: (item: TItem) => void,
  onEditItemPress: (item: TItem) => void,
|};

type State = {|
  isDeleteModalVisible: boolean,
|};

class QuickActions<TItem> extends React.Component<Props<TItem>, State> {
  static defaultProps = {
    onDeleteItemPress: () => {},
    onEditItemPress: () => {},
  };

  state = {
    isDeleteModalVisible: false,
  };

  _hideDeleteModal = (): void =>
    this.setState(() => ({ isDeleteModalVisible: false }));

  _showDeleteModal = (): void =>
    this.setState(() => ({ isDeleteModalVisible: true }));

  _onDeleteModalConform = () => {
    this._hideDeleteModal();
    this.props.onDeleteItemPress(this.props.item);
  };

  _onEditItemPress = (): void => this.props.onEditItemPress(this.props.item);

  render() {
    return (
      <View style={styles.container}>
        <SwipeableActionButton
          containerStyle={styles.editButtonContainer}
          iconName="create"
          onPress={this._onEditItemPress}
          iconStyle={styles.editIcon}
        />
        <SwipeableActionButton
          containerStyle={styles.deleteButtonContainer}
          iconName="delete"
          onPress={this._showDeleteModal}
          iconStyle={styles.deleteIcon}
        />
        <DeleteModal
          isVisible={this.state.isDeleteModalVisible}
          message={this.props.deleteModalMessage}
          onCancelButtonPress={this._hideDeleteModal}
          onDeleteButtonPress={this._onDeleteModalConform}
        />
      </View>
    );
  }
}

export default QuickActions;
