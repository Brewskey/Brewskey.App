import * as React from 'react';
import { useState } from 'react';

import { WifiListEmpty } from 'components/WifiSetup/WifiList/WifiListEmpty';
import { WifiListError } from 'components/WifiSetup/WifiList/WifiListError';
import { WifiListItem } from 'components/WifiSetup/WifiList/WifiListItem';
import { Form } from 'common/form/Form';
import { List } from 'common/List';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { useGetWifiNetworks } from 'hooks/queries/SoftApQueries';

import type { WifiNetwork } from 'types';

interface Props {
  ListHeaderComponent?: React.ReactElement | null | undefined;
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>;
  isSettingUpWifi: boolean;
}

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
        isConnecting={isExpanded ? isLoading || isSettingUpWifi : false}
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
        listType="flatList"
        onRefresh={
          !isLoading
            ? () => {
                void refetch();
              }
            : undefined
        }
        renderItem={renderItem}
        testID="wifi-networks-list"
      />
    </Form>
  );
};
