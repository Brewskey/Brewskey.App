// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SwipeableActionButton from './SwipeableActionButton';
import DeleteModal from '../components/modals/DeleteModal';
import ToggleStore from '../stores/ToggleStore';
import { COLORS } from '../theme';

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
  deleteModalTitle: string,
|};

@observer
class QuickActions<TItem> extends React.Component<Props<TItem>> {
  static defaultProps = {
    onDeleteItemPress: () => {},
    onEditItemPress: () => {},
  };

  _modalToggleStore = new ToggleStore();

  _onDeleteModalConform = () => {
    this._modalToggleStore.toggleOff();
    this.props.onDeleteItemPress(this.props.item);
  };

  _onEditItemPress = (): void => this.props.onEditItemPress(this.props.item);

  render() {
    const { deleteModalTitle } = this.props;

    return (
      <View style={styles.container}>
        <SwipeableActionButton
          containerStyle={styles.editButtonContainer}
          iconName="create"
          iconStyle={styles.editIcon}
          onPress={this._onEditItemPress}
        />
        <SwipeableActionButton
          containerStyle={styles.deleteButtonContainer}
          iconName="delete"
          iconStyle={styles.deleteIcon}
          onPress={this._modalToggleStore.toggleOn}
        />
        <DeleteModal
          title={deleteModalTitle}
          isVisible={this._modalToggleStore.isToggled}
          message={this.props.deleteModalMessage}
          onCancelButtonPress={this._modalToggleStore.toggleOff}
          onDeleteButtonPress={this._onDeleteModalConform}
        />
      </View>
    );
  }
}

export default QuickActions;
