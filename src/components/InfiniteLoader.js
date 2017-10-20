// @flow

import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ActivityIndicator, Platform } from 'react-native';

type Props = {|
  fetchNextData: () => Promise<void>,
|};

export type InfiniteLoaderChildProps = {
  loadingIndicator: React.Node,
  onEndReached: () => Promise<void>,
  onEndReachedThreshold: number,
};

@observer
class InfiniteLoader extends React.Component<Props> {
  @observable _loading = false;

  @action
  _setLoading = (loading: boolean) => {
    this._loading = loading;
  };

  componentWillMount() {
    this._fetchNextData();
  }

  _fetchNextData = async (): Promise<void> => {
    this._setLoading(true);
    await this.props.fetchNextData();
    this._setLoading(false);
  };

  _onEndReached = () => {
    if (this._loading) {
      return;
    }
    this._fetchNextData();
  };

  render(): React.Node {
    if (!this.props.children) {
      return null;
    }
    if (!this.props.children.call) {
      throw new Error('InfiniteLoader children should be a function or null');
    }

    return this.props.children({
      loadingIndicator: this._loading ? (
        <ActivityIndicator animating size="large" />
      ) : null,
      onEndReached: this._onEndReached,
      onEndReachedThreshold: Platform.OS === 'ios' ? 0 : 0.5,
    });
  }
}

export default InfiniteLoader;
