import * as React from 'react';

import { useRouter } from 'expo-router';

import { NULL_STRING_PLACEHOLDER } from '@/constants';
import { UserAvatar } from 'common/avatars/UserAvatar';
import { ListItem } from 'common/ListItem';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { QuickActions } from 'common/QuickActions';
import { SwipeableList } from 'common/SwipeableList';
import { PintCounter } from 'components/PintCounter';
import { KegSectionHeader } from 'components/poursLists/KegSectionHeader';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeletePour, useGetPours } from 'hooks/queries/PourQueries';
import { fromNow } from 'utils/dateFormat';

import type { EntityID, Pour, QueryOptions } from '@brewskey/js-api';
import type { SectionListData } from 'react-native';

import type { ListComponentTypes } from 'common/List';
import type { RenderProps } from 'common/SwipeableList';

interface Props {
  ListHeaderComponent?: ListComponentTypes;
  canDeletePours: boolean;
  queryOptions?: QueryOptions;
}

type KegSection = SectionListData<Pour> & { kegId: EntityID };

export const SectionPoursList: React.FC<Props> = ({
  queryOptions = {},
  ListHeaderComponent,
  canDeletePours,
}) => {
  const pours = useGetPours({
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
    ...queryOptions,
  });
  const router = useRouter();
  const deletePour = useDeletePour();
  const addSnackBarMessage = useAddSnackBarMessage();

  const _onItemPress = (pour: Pour) => {
    router.navigate({
      pathname: '/profile/[id]',
      params: { id: String(pour.owner.id) },
    });
  };

  const _onDeleteItemPress = async (pour: Pour): Promise<void> => {
    await deletePour.mutateAsync(pour.id);
    await pours.refetch();
    addSnackBarMessage({ content: 'The pour was deleted' });
  };

  const _renderRow = ({
    info: { item: pour },
  }: RenderProps<Pour>): React.ReactElement => {
    const pourOwnerUserName = pour.owner
      ? pour.owner.userName
      : NULL_STRING_PLACEHOLDER;
    const title = pour.owner
      ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
      : `${pour.ounces.toFixed(1)} oz`;

    const params = {
      leftAvatar: (
        <UserAvatar
          userName={pourOwnerUserName}
        />
      ),
      rightIcon: (
        <PintCounter beverageID={pour?.beverage?.id} ounces={pour.ounces} />
      ),
      onPress: pour.owner != null ? _onItemPress : undefined,
      chevron: false,
      item: pour,
      title,
      subtitle: fromNow(pour.pourDate),
      testID: `pour-item-${pour.id}`,
    };

    if (canDeletePours) {
      return (
        <ListItem
          {...params}
          swipeable
          slideoutComponent={
            <QuickActions
              deleteModalMessage="Are you sure you want to delete this pour?"
              deleteModalTitle="Delete Pour"
              item={pour}
              onDeleteItemPress={_onDeleteItemPress}
            />
          }
        />
      );
    }

    return <ListItem {...params} />;
  };

  const _keyExtractor = (pour: Pour, _index: number): string =>
    pour.id.toString();

  const allPours = (pours.data?.pages ?? []).flat();
  const kegIds = new Set(allPours.map((pour) => pour.keg.id));

  const kegWithPours: KegSection[] = Array.from(kegIds).map((kegId) => ({
    kegId,
    data: allPours.filter((pour) => pour.keg.id === kegId),
  }));
  return (
    <SwipeableList
      stickySectionHeadersEnabled
      keyExtractor={_keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={pours.isLoading} />}
      ListHeaderComponent={ListHeaderComponent}
      listType="sectionList"
      onEndReached={pours.fetchNextPage}
      onRefresh={() => {
        void pours.refetch();
      }}
      renderItem={_renderRow}
      sections={kegWithPours}
      renderSectionHeader={(info) => (
        <KegSectionHeader section={info.section as KegSection} />
      )}
    />
  );
};
