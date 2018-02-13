// @flow

import type { WifiNetwork } from '../../../types';
import type WifiSetupStore from '../../../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../../../common/InjectedComponent';
import WifiListItem from './WifiListItem';
import WifiListEmpty from './WifiListEmpty';
import WifiListError from './WifiListError';
import List from '../../../common/List';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { WifiNetworksStore } from '../../../stores/ApiRequestStores/SoftApApiStores';
import LoadingListFooter from '../../../common/LoadingListFooter';

type InjectedProps = {|
  wifiSetupStore: WifiSetupStore,
|};

@observer
class WifiList extends InjectedComponent<InjectedProps> {
  @observable _expandedRowKey = null;

  @computed
  get _rows(): Array<WifiNetwork> {
    return WifiNetworksStore.get().hasValue()
      ? WifiNetworksStore.get().getValueEnforcing()
      : [];
  }

  @action
  _setExpandedRowKey = (rowKey: string) => {
    this._expandedRowKey = rowKey;
  };

  _keyExtractor = (item: WifiNetwork): string => item.ssid;

  _renderItem = ({
    index,
    item,
  }: {
    index: number,
    item: WifiNetwork,
  }): React.Node => {
    const rowKey = this._keyExtractor(item);
    const isExpanded = rowKey === this._expandedRowKey;
    return (
      <WifiListItem
        error={this.props.wifiSetupLoader.getError()}
        index={index}
        isConnecting={isExpanded && this.props.wifiSetupLoader.isLoading()}
        isExpanded={isExpanded}
        item={item}
        onConnectPress={this.props.onConnectPress}
        onPress={this._setExpandedRowKey}
        rowKey={rowKey}
      />
    );
  };

  render() {
    const isLoading = WifiNetworksStore.get().isLoading();
    const hasError = WifiNetworksStore.get().hasError();

    let ListEmptyComponent = hasError ? <WifiListError /> : <WifiListEmpty />;
    ListEmptyComponent = isLoading ? null : ListEmptyComponent;

    return (
      <List
        data={this._rows}
        extraData={[this._expandedRowKey, this.props.wifiSetupLoader]}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        onRefresh={!isLoading ? WifiNetworksStore.flushCache : null}
        renderItem={this._renderItem}
      />
    );
  }
}

export default WifiList;
