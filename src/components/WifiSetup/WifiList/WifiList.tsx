import * as React from 'react';
import { useState } from 'react';

import { Form } from 'common/form/Form';
import { List } from 'common/List';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { WifiListEmpty } from 'components/WifiSetup/WifiList/WifiListEmpty';
import { WifiListError } from 'components/WifiSetup/WifiList/WifiListError';
import { WifiListItem } from 'components/WifiSetup/WifiList/WifiListItem';
import { useGetWifiNetworks } from 'hooks/queries/SoftApQueries';

import { HiddenWifiInput } from './HiddenWifiInput';

import type { WifiNetwork } from 'types';

export const WifiList: React.FC = () => {
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
        isExpanded={isExpanded}
        item={item}
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
        ListHeaderComponent={<HiddenWifiInput />}
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
