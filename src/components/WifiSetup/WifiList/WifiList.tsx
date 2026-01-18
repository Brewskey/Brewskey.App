import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import WifiListItem from './WifiListItem';
import WifiListEmpty from './WifiListEmpty';
import WifiListError from './WifiListError';
import List from '../../../common/List';
import LoadingListFooter from '../../../common/LoadingListFooter';
import { useState } from 'react';
import { useGetWifiNetworks } from '../../../hooks/queries/SoftApQueries';
import { Form } from '../../../common/form/Form';

type Props = {
  ListHeaderComponent?: React.ReactElement | null | undefined;
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>;
  isSettingUpWifi: boolean;
};

export const WifiList: React.FC<Props> = ({
  ListHeaderComponent,
  isSettingUpWifi,
  onConnectPress,
}) => {
  const [expandedRowKey, setExpandedRowKey] = useState<string | undefined>();
  const {
    data: wifiNetworks,
    error,
    isLoading,
    isError,
    refetch,
  } = useGetWifiNetworks();

  const keyExtractor = (item: WifiNetwork, index: number): string =>
    item.ssid + index;

  const renderItem = ({
    index,
    item,
  }: {
    index: number;
    item: WifiNetwork;
  }): React.ReactElement => {
    const rowKey = keyExtractor(item, index);
    const isExpanded = rowKey === expandedRowKey;
    return (
      <WifiListItem
        error={error}
        index={index}
        isConnecting={isExpanded && (isLoading || isSettingUpWifi)}
        isExpanded={isExpanded}
        item={item}
        onConnectPress={onConnectPress}
        onPress={setExpandedRowKey}
        rowKey={rowKey}
      />
    );
  };

  let ListEmptyComponent: React.ReactElement | null = isError ? (
    <WifiListError />
  ) : (
    <WifiListEmpty />
  );
  ListEmptyComponent = isLoading ? null : ListEmptyComponent;

  return (
    <Form>
      <List
        data={{ pages: [wifiNetworks ?? []], pageParams: [{}] }}
        extraData={{ expandedRowKey }}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        onRefresh={!isLoading ? refetch : undefined}
        renderItem={renderItem}
      />
    </Form>
  );
};

export default WifiList;
