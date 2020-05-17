// @flow

import type { Section } from '../types';
import type { ScrollEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { RenderItemProps } from 'react-native/Libraries/Lists/VirtualizedList';

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

type BaseProps<TEntity> = {||};

export type ListProps<TEntity> = {|
  ListEmptyComponent?: ?(React.ComponentType<any> | React.Node),
  ListFooterComponent?: ?(React.ComponentType<any> | React.Node),
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  bounceFirstRowOnMount?: boolean,
  disableVirtualization?: boolean,
  data?: Array<TEntity>,
  extraData?: any,
  horizontal?: boolean,
  initialNumToRender?: number,
  innerRef?: $FlowFixMe,
  keyExtractor: (TEntity, number) => string,
  listType?: ListType,
  maxToRenderPerBatch?: number,
  onDeleteItemPress?: (TEntity) => Promise<void>,
  onEndReached?: () => void,
  onRefresh?: () => Promise<void> | void,
  onScroll?: (ScrollEvent) => void,
  preventSwipeRight?: boolean,
  renderSectionHeader?: ?(info: {
    section: Object,
    ...
  }) => React.Node,
  renderSectionFooter?: ?(info: {
    section: Object,
    ...
  }) => React.Node,
  sections?: Array<Section<TEntity>>,
  slideoutComponent?: React.AbstractComponent<any>,
  stickySectionHeadersEnabled?: boolean,
|};

type Props<TEntity> = {|
  ...ListProps<TEntity>,
  renderItem?: (RenderItemProps<TEntity>) => React.Node,
|};

type State = {|
  isRefreshing: boolean,
|};

class List<TEntity> extends React.Component<Props<TEntity>, State> {
  static defaultProps = {
    listType: ('flatList': 'flatList'),
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

  _renderFlatList(renderProps: RenderItemProps<TEntity>): React.Node {
    const { renderItem } = this.props;
    if (renderItem == null) {
      return null;
    }
    return renderItem(renderProps);
  }

  _renderSectionList(
    renderProps: RenderItemProps<TEntity>,
  ): null | React.Element<any> {
    const { renderItem } = this.props;
    if (renderItem == null) {
      return null;
    }
    return (renderItem(renderProps): any);
  }

  render(): React.Node {
    const {
      bounceFirstRowOnMount,
      innerRef,
      listType,
      onDeleteItemPress,
      onRefresh,
      preventSwipeRight,
      renderItem: _,
      sections,
      renderSectionFooter,
      renderSectionHeader,
      slideoutComponent,
      ListEmptyComponent,
      ListFooterComponent,
      ListHeaderComponent,
      ...rest
    } = this.props;
    if (this.props.listType === 'flatList') {
      <FlatList
        ListEmptyComponent={(ListEmptyComponent: any)}
        ListFooterComponent={(ListFooterComponent: any)}
        ListHeaderComponent={(ListHeaderComponent: any)}
        renderSectionFooter={(renderSectionFooter: any)}
        renderSectionHeader={(renderSectionHeader: any)}
        slideoutComponent={slideoutComponent}
        bounceFirstRowOnMount={bounceFirstRowOnMount}
        contentContainerStyle={styles.contentContainerStyle}
        {...rest}
        ref={innerRef}
        onDeleteItemPress={onDeleteItemPress}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? (this._onRefresh: any) : null}
        preventSwipeRight={preventSwipeRight}
        refreshing={this.state.isRefreshing}
        renderItem={this._renderFlatList}
      />;
    }

    return (
      <SectionList
        ListEmptyComponent={(ListEmptyComponent: any)}
        ListFooterComponent={(ListFooterComponent: any)}
        ListHeaderComponent={(ListHeaderComponent: any)}
        renderSectionFooter={(renderSectionFooter: any)}
        renderSectionHeader={(renderSectionHeader: any)}
        contentContainerStyle={styles.contentContainerStyle}
        {...rest}
        ref={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? (this._onRefresh: any) : null}
        refreshing={this.state.isRefreshing}
        sections={nullthrows((sections: any))}
        renderItem={this._renderSectionList}
      />
    );
  }
}

export default List;
