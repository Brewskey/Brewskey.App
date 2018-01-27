// @flow

// eslint-disable-next-line
import type { Props as SectionListProps } from 'FlatList';

import * as React from 'react';
import { SectionList as RNSectionList } from 'react-native';
import { ON_END_REACHED_THRESHOLD } from '../constants';

type Props<TEntity> = {|
  extraData?: any,
  innerRef: React.Ref<SectionList<TEntity>>,
|} & SectionListProps<TEntity>;

type State = {|
  isRefreshing: boolean,
|};

class SectionList<TEntity> extends React.Component<Props<TEntity>, State> {
  static defaultProps = {
    ...RNSectionList.defaultProps,
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
      <RNSectionList
        extraData={extraData}
        innerRef={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? this._onRefresh : null}
        refreshing={this.state.isRefreshing}
        {...rest}
      />
    );
  }
}

export default SectionList;
