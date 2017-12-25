// @flow

// eslint-disable-next-line
import type { Props as FlatListProps } from 'FlatList';

import * as React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import { ON_END_REACHED_THRESHOLD } from '../constants';

type Props<TEntity> = {|
  extraData?: any,
  innerRef: React.Ref<RNFlatList<TEntity>>,
|} & FlatListProps<TEntity>;

type State = {|
  isRefreshing: boolean,
|};

class FlatList<TEntity> extends React.Component<Props<TEntity>, State> {
  static defaultProps = {
    ...RNFlatList.defaultProps,
  };

  state = {
    isRefreshing: false,
  };

  _onRefresh = async (): Promise<void> => {
    if (!this.props.onRefresh) {
      return;
    }
    this.setState(() => ({ isRefreshing: true }));
    await this.props.onRefresh();
    this.setState(() => ({ isRefreshing: false }));
  };

  render() {
    const { extraData, innerRef, onRefresh, ...rest } = this.props;
    return (
      <RNFlatList
        extraData={extraData}
        innerRef={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? this._onRefresh : null}
        refreshing={this.state.isRefreshing}
        removeClippedSubviews
        {...rest}
      />
    );
  }
}

export default FlatList;
