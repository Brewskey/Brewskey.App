// @flow

// eslint-disable-next-line
import type { Props as FlatListProps } from 'FlatList';

import * as React from 'react';
import { FlatList, SectionList } from 'react-native';
import { ON_END_REACHED_THRESHOLD } from '../constants';

type ListType = 'flatList' | 'sectionList';

export type Props<TEntity> = {
  extraData?: any,
  innerRef?: React.Ref<FlatList<TEntity> | SectionList<TEntity>>,
  listType: ListType,
  // todo should be ...SectionList also, but they can't be imported from 'SectionList'
  ...FlatListProps<TEntity>,
};

type State = {|
  isRefreshing: boolean,
|};

class List<TEntity> extends React.Component<Props<TEntity>, State> {
  static defaultProps = {
    listType: 'flatList',
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
    const { onRefresh, listType, ...rest } = this.props;
    const ListComponent = listType === 'flatList' ? FlatList : SectionList;

    return (
      <ListComponent
        {...rest}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? this._onRefresh : null}
        refreshing={this.state.isRefreshing}
      />
    );
  }
}

export default List;
