import type { Section } from '../types';

import * as React from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SectionList,
  SectionListData,
  StyleSheet,
} from 'react-native';
import { ON_END_REACHED_THRESHOLD } from '../constants';
import { InfiniteData } from '@tanstack/react-query';

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export type ListComponentTypes =
  | React.ComponentType
  | React.ReactElement
  | null
  | undefined;

export type ListProps<TEntity> = {
  ListEmptyComponent?: ListComponentTypes;
  ListFooterComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  bounceFirstRowOnMount?: boolean;
  disableVirtualization?: boolean;
  extraData?: Record<string, unknown>;
  horizontal?: boolean;
  initialNumToRender?: number;
  keyExtractor: (arg1: TEntity, arg2: number) => string;
  maxToRenderPerBatch?: number;
  onEndReached?: () => void;
  onRefresh?: () => Promise<unknown> | unknown;
  onScroll?: (arg1: NativeSyntheticEvent<NativeScrollEvent>) => void;
  stickySectionHeadersEnabled?: boolean;
} & (
  | {
      innerRef?: React.LegacyRef<FlatList<TEntity>> | undefined;
      listType: 'flatList';
      data: InfiniteData<TEntity[]> | undefined;
    }
  | {
      innerRef?: React.LegacyRef<SectionList<TEntity>> | undefined;
      listType: 'sectionList';
      renderSectionHeader?: (info: {
        section: SectionListData<TEntity>;
      }) => React.ReactElement | null;
      renderSectionFooter?: (info: {
        section: SectionListData<TEntity>;
      }) => React.ReactElement | null;
      sections: ReadonlyArray<SectionListData<TEntity>>;
    }
);

type Props<TEntity> = ListProps<TEntity> & {
  renderItem?: (arg1: ListRenderItemInfo<TEntity>) => React.ReactElement;
};

type State = {
  isRefreshing: boolean;
};

class List<TEntity> extends React.Component<Props<TEntity>, State> {
  static defaultProps = {
    listType: 'flatList' as const,
  };

  state: {
    isRefreshing: boolean;
  } = {
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

  _renderFlatList = (
    info: ListRenderItemInfo<TEntity>,
  ): React.ReactElement | null => {
    const { renderItem } = this.props;
    if (renderItem == null) {
      return null;
    }
    return renderItem(info);
  };

  render(): React.ReactElement {
    const {
      bounceFirstRowOnMount,
      innerRef,
      onRefresh,
      renderItem: _,
      ListEmptyComponent,
      ListFooterComponent,
      ListHeaderComponent,
      ...rest
    } = this.props;
    if (this.props.listType === 'sectionList') {
      return (
        <SectionList<TEntity>
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          ListHeaderComponent={ListHeaderComponent}
          renderSectionFooter={this.props.renderSectionFooter}
          renderSectionHeader={this.props.renderSectionHeader}
          contentContainerStyle={styles.contentContainerStyle}
          // {...rest}
          // ref={innerRef}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          onRefresh={onRefresh ? this._onRefresh : null}
          refreshing={this.state.isRefreshing}
          sections={this.props.sections}
          renderItem={this.props.renderItem}
        />
      );
    }

    const data = this.props.data?.pages.flat() ?? [];
    return (
      <FlatList<TEntity>
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        {...rest}
        data={data}
        bounces={bounceFirstRowOnMount}
        contentContainerStyle={styles.contentContainerStyle}
        //ref={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={onRefresh}
          />
        }
        onScroll={this.props.onScroll}
        renderItem={this._renderFlatList}
      />
    );
  }
}

export default List;
