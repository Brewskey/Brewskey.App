// @flow

import * as React from 'react';
import SwipeableActionButton from '../SwipeableFlatList/SwipeableActionButton';
// imported from experimental react-native
// eslint-disable-next-line
import SwipeableQuickActions from 'SwipeableQuickActions';
import DeleteModal from './DeleteModal';

type Props<TItem> = {|
  deleteModalMessage: string,
  item: TItem,
  onDeleteItemPress: (item: TItem) => void | Promise<void>,
  onEditItemPress: (item: TItem) => void | Promise<void>,
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

  _onEditItemPress = (): void | Promise<void> =>
    this.props.onEditItemPress(this.props.item);

  render() {
    return (
      <SwipeableQuickActions>
        <SwipeableActionButton
          iconName="create"
          onPress={this._onEditItemPress}
        />
        <SwipeableActionButton
          iconName="delete"
          onPress={this._showDeleteModal}
        />
        <DeleteModal
          isVisible={this.state.isDeleteModalVisible}
          message={this.props.deleteModalMessage}
          onCancelButtonPress={this._hideDeleteModal}
          onDeleteButtonPress={this._onDeleteModalConform}
        />
      </SwipeableQuickActions>
    );
  }
}

export default QuickActions;
