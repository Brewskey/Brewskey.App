// @flow

import * as React from 'react';
import SwipeableActionButton from './SwipeableFlatList/SwipeableActionButton';
// imported from experimental react-native
// eslint-disable-next-line
import SwipeableQuickActions from 'SwipeableQuickActions';

type Props<TItem> = {|
  item: TItem,
  onDeleteItemPress: (item: TItem) => void,
  onEditItemPress: (item: TItem) => void,
|};

class QuickActions<TItem> extends React.Component<Props<TItem>> {
  static defaultProps = {
    onDeleteItemPress: () => {},
    onEditItemPress: () => {},
  };

  _onDeleteItemPress = (): void =>
    this.props.onDeleteItemPress(this.props.item);

  _onEditItemPress = (): void => this.props.onEditItemPress(this.props.item);

  render(): React.Node {
    return (
      <SwipeableQuickActions>
        <SwipeableActionButton
          iconName="create"
          onPress={this._onEditItemPress}
        />
        <SwipeableActionButton
          iconName="delete"
          onPress={this._onDeleteItemPress}
        />
      </SwipeableQuickActions>
    );
  }
}

export default QuickActions;
