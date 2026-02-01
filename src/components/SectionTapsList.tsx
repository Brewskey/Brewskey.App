import * as React from 'react';
import { useMemo, useRef } from 'react';

import { useRouter } from 'expo-router';
import nullthrows from 'nullthrows';
import { View } from 'react-native';

import { TapListItem } from 'components/TapListItem';
import { ListSectionHeader } from 'common/ListSectionHeader';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { QuickActions } from 'common/QuickActions';
import { SwipeableList } from 'common/SwipeableList';
import { SwipeableRow } from 'common/SwipeableRow';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeleteTap, useGetTaps } from 'hooks/queries/TapQueries';

import type { Tap } from '@brewskey/js-api';

import type { RenderProps, SwipeableListRef } from 'common/SwipeableList';
import type { RowItemProps } from 'common/SwipeableRow';
import type { Section } from 'types';

interface Props {
  ListEmptyComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  ListHeaderComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
  // todo add queryOptions?
}

const SwipeableRowItem = ({
  index,
  item,
  onItemPress,
}: RowItemProps<Tap>): React.ReactElement => (
  <TapListItem index={index} onPress={onItemPress} tap={item} />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Tap>): React.ReactElement => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete the Tap"
    deleteModalTitle="Delete tap"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

// Helper component to use hooks properly
const SwipeableRowWithDelete: React.FC<
  RenderProps<Tap> & {
    onEditItemPress: (tap: Tap) => void;
    onItemPress: (tap: Tap) => void;
    rowItemComponent: React.ComponentType<RowItemProps<Tap>>;
    slideoutComponent: React.ComponentType<RowItemProps<Tap>>;
  }
> = ({
  info: { item, index, separators },
  onEditItemPress,
  onItemPress,
  rowItemComponent,
  slideoutComponent,
  ...swipeableStateProps
}) => {
  const deleteTap = useDeleteTap();
  const addSnackBarMessage = useAddSnackBarMessage();

  return (
    <SwipeableRow
      {...swipeableStateProps}
      index={index}
      item={item}
      maxSwipeDistance={150}
      onEditItemPress={onEditItemPress}
      onItemPress={onItemPress}
      rowItemComponent={rowItemComponent}
      separators={separators}
      slideoutComponent={slideoutComponent}
      onDeleteItemPress={async (tap): Promise<void> => {
        await deleteTap.mutateAsync(tap.id);
        addSnackBarMessage({ content: 'The tap was deleted' });
      }}
    />
  );
};

export const SectionTapsList: React.FC<Props> = ({
  ListEmptyComponent,
  ListHeaderComponent,
}) => {
  const router = useRouter();
  const swipeableListRef = useRef<SwipeableListRef>(null);

  const tapsQuery = useGetTaps({
    orderBy: [
      {
        column: 'device/id',
        direction: 'desc',
      } as const,
    ],
  });

  const sections = useMemo<Section<Tap>[]>(() => {
    const flatTaps = tapsQuery.data?.pages.flatMap((page) => page) ?? [];
    if (flatTaps.length === 0) {
      return [];
    }

    // Group taps by device ID, preserving order of first appearance (matching old store behavior)
    // Get unique device IDs in order of first appearance
    const uniqueDeviceIds = Array.from(
      new Set(flatTaps.map((tap) => tap.device.id)),
    );

    // Create sections for each device ID
    return uniqueDeviceIds.map((deviceID) => {
      const deviceTaps = flatTaps.filter((tap) => tap.device.id === deviceID);
      return {
        data: deviceTaps,
        title: nullthrows(deviceTaps[0]).device.name,
      };
    });
  }, [tapsQuery.data]);

  const keyExtractor = ({ id }: Tap): string => id.toString();

  const onItemPress = (item: Tap): void => {
    router.navigate({
      pathname: '/taps/[tapId]/on_tap',
      params: { tapId: String(item.id) },
    });
  };

  const onEditItemPress = ({ id }: Tap) => {
    router.navigate({
      pathname: '/taps/[tapId]/edit/keg',
      params: { tapId: String(id) },
    });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: Section<Tap>;
  }): React.ReactElement => <ListSectionHeader title={section.title} />;

  const renderRow = (props: RenderProps<Tap>): React.ReactElement => (
    <SwipeableRowWithDelete
      {...props}
      onEditItemPress={onEditItemPress}
      onItemPress={onItemPress}
      rowItemComponent={SwipeableRowItem}
      slideoutComponent={Slideout}
    />
  );

  const handleEndReached = () => {
    if (tapsQuery.hasNextPage && !tapsQuery.isFetchingNextPage) {
      tapsQuery.fetchNextPage();
    }
  };

  const handleRefresh = () => {
    tapsQuery.refetch();
  };

  return (
    <View style={{ flex: 1 }} testID="taps-list">
      <SwipeableList
        ref={swipeableListRef}
        stickySectionHeadersEnabled
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        listType="sectionList"
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        renderItem={renderRow}
        renderSectionHeader={renderSectionHeader}
        sections={sections}
        ListEmptyComponent={
          tapsQuery.isLoading ? undefined : ListEmptyComponent
        }
        ListFooterComponent={
          <LoadingListFooter
            isLoading={tapsQuery.isFetchingNextPage || tapsQuery.isLoading}
          />
        }
      />
    </View>
  );
};
