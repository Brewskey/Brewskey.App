// @flow

import type { LoadObject } from 'brewskey.js-api';
import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import WifiListItem from './WifiListItem';
import WifiListEmpty from './WifiListEmpty';
import WifiListError from './WifiListError';
import List from '../../../common/List';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import WifiSetupStore from '../../../stores/WifiSetupStore';
import LoadingListFooter from '../../../common/LoadingListFooter';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>,
  isSettingUpWifi: boolean,
|};

@observer
class WifiList extends React.Component<Props> {
  @observable _expandedRowKey = null;

  @computed
  get _rows(): Array<WifiNetwork> {
    return this.props.wifiSetupLoader.getValue() ?? [];
  }

  @action
  _setExpandedRowKey = (rowKey: string) => {
    this._expandedRowKey = rowKey;
  };

  _keyExtractor = (item: WifiNetwork, index: number): string => item.ssid + index;

  _renderItem = ({
    index,
    item,
  }: {
    index: number,
    item: WifiNetwork,
  }): React.Node => {
    const rowKey = this._keyExtractor(item, index);
    const isExpanded = rowKey === this._expandedRowKey;
    return (
      <WifiListItem
        error={this.props.wifiSetupLoader.getError()}
        index={index}
        isConnecting={isExpanded && (this.props.wifiSetupLoader.isLoading() || this.props.isSettingUpWifi)}
        isExpanded={isExpanded}
        item={item}
        onConnectPress={this.props.onConnectPress}
        onPress={this._setExpandedRowKey}
        rowKey={rowKey}
      />
    );
  };

  render(): React.Node {
    const {wifiSetupLoader} = this.props;
    const isLoading = wifiSetupLoader.isLoading();
    const hasError = wifiSetupLoader.hasError();

    console.log("list", this.props.wifiSetupLoader)

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
        onRefresh={!isLoading ? WifiSetupStore.loadWifiNetworks : undefined}
        renderItem={this._renderItem}
      />
    );
  }
}

export default WifiList;
