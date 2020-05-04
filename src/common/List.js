// @flow

import type { Section } from '../types';

import * as React from 'react';
import { FlatList, SectionList, StyleSheet } from 'react-native';
import nullthrows from 'nullthrows';
import { ON_END_REACHED_THRESHOLD } from '../constants';

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

type ListType = 'flatList' | 'sectionList';

export type Props<TEntity, VirtualizedListProps> = {|
  ...VirtualizedListProps,
  data?: Array<TEntity>,
  extraData?: any,
  innerRef?: $FlowFixMe,
  listType?: ListType,
  onRefresh?: () => Promise<void>,
  sections?: Array<Section<TEntity>>,
|};

type State = {|
  isRefreshing: boolean,
|};

class List<TEntity, VirtualizedListProps> extends React.Component<
  Props<TEntity, VirtualizedListProps>,
  State,
> {
  static defaultProps: {| listType: ListType |} = {
    listType: 'flatList',
  };

  state: {| isRefreshing: boolean |} = {
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

  render(): React.Node {
    const { onRefresh, innerRef, listType, sections, ...rest } = this.props;
    if (listType === 'flatList') {
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        {...rest}
        ref={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? (this._onRefresh: any) : null}
        refreshing={this.state.isRefreshing}
      />;
    }

    return (
      <SectionList
        contentContainerStyle={styles.contentContainerStyle}
        {...rest}
        ref={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? (this._onRefresh: any) : null}
        refreshing={this.state.isRefreshing}
        sections={nullthrows(sections)}
      />
    );
  }
}

export default List;
