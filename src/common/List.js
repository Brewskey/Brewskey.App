// @flow

import type { Props as VirtualizedListProps } from 'react-native/Libraries/Lists/VirtualizedList';
import type { Section } from '../types';

import * as React from 'react';
import { FlatList, SectionList } from 'react-native';
import { ON_END_REACHED_THRESHOLD } from '../constants';

type ListType = 'flatList' | 'sectionList';

export type Props<TEntity> = VirtualizedListProps & {
  data?: Array<TEntity>,
  extraData?: any,
  innerRef?: $FlowFixMe,
  listType?: ListType,
  sections?: Array<Section<TEntity>>,
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
    const { onRefresh } = this.props;
    if (!onRefresh) {
      return;
    }
    this.setState(() => ({ isRefreshing: true }));
    await onRefresh();
    this.setState(() => ({ isRefreshing: false }));
  };

  render() {
    const { onRefresh, listType, sections, ...rest } = this.props;
    const ListComponent = listType === 'flatList' ? FlatList : SectionList;

    return (
      <ListComponent
        {...rest}
        sections={sections}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? (this._onRefresh: any) : null}
        refreshing={this.state.isRefreshing}
      />
    );
  }
}

export default List;
