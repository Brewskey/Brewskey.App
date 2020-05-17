// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import nullthrows from 'nullthrows';
import { observer } from 'mobx-react';
import SwipeableActionButton from './SwipeableActionButton';
import Fragment from './Fragment';
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
  deleteModalTitle: string,
  item: TItem,
  onDeleteItemPress?: (item: TItem) => void | Promise<void>,
  onEditItemPress?: (item: TItem) => void,
|};

@observer
class QuickActions<TItem> extends React.Component<Props<TItem>> {
  _modalToggleStore = new ToggleStore();

  _onDeleteModalConfirm = () => {
    this._modalToggleStore.toggleOff();
    nullthrows(this.props.onDeleteItemPress)(this.props.item);
  };

  _onEditItemPress = (): void =>
    nullthrows(this.props.onEditItemPress)(this.props.item);

  render(): React.Node {
    const { deleteModalTitle, onDeleteItemPress, onEditItemPress } = this.props;

    return (
      <View style={styles.container}>
        {!onEditItemPress ? null : (
          <SwipeableActionButton
            containerStyle={styles.editButtonContainer}
            iconName="create"
            iconStyle={styles.editIcon}
            onPress={this._onEditItemPress}
          />
        )}
        {!onDeleteItemPress ? null : (
          <Fragment>
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
              onDeleteButtonPress={this._onDeleteModalConfirm}
            />
          </Fragment>
        )}
      </View>
    );
  }
}

export default QuickActions;
