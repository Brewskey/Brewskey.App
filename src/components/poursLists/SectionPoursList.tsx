import type { QueryOptions, Pour } from '@brewskey/js-api';

import * as React from 'react';
import moment from 'moment';

import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { RenderProps, SwipeableList } from '../../common/SwipeableList';
import QuickActions from '../../common/QuickActions';
import ListItem from '../../common/ListItem';
import UserAvatar from '../../common/avatars/UserAvatar';
import LoadingListFooter from '../../common/LoadingListFooter';
import { KegSectionHeader } from './KegSectionHeader';
import PintCounter from '../../components/PintCounter';
import { ListComponentTypes } from '../../common/List';
import { useDeletePour, useGetPours } from '../../hooks/queries/PourQueries';
import { useRouter } from 'expo-router';
import { useAddSnackBarMessage } from '../../hooks/context/SnackBarContext';

type Props = {
  ListHeaderComponent?: ListComponentTypes;
  canDeletePours: boolean;
  queryOptions?: QueryOptions;
};

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
    router.navigate({ pathname: '/(tabs)/profile/[id]', params: { id: String(pour.owner.id) } });
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
      leftAvatar: <UserAvatar userName={pourOwnerUserName} />,
      rightIcon: (
        <PintCounter beverageID={pour?.beverage?.id} ounces={pour.ounces} />
      ),
      onPress: pour.owner != null ? _onItemPress : undefined,
      chevron: false,
      item: pour,
      title,
      subtitle: moment(pour.pourDate).fromNow(),
      testID: `pour-item-${pour.id}`,
    };

    if (canDeletePours) {
      return (
        <ListItem
          {...params}
          swipeable={true}
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

  const _keyExtractor = (pour: Pour, _index: number): string => pour.id.toString();

  const allPours = (pours.data?.pages ?? []).flat();
  const kegIds = new Set(allPours.map((pour) => pour.keg.id));

  const kegWithPours = Array.from(kegIds).map((kegId) => ({
    kegId,
    data: allPours.filter((pour) => pour.keg.id === kegId),
  }));
  return (
    <SwipeableList
      keyExtractor={_keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={pours.isLoading} />}
      ListHeaderComponent={ListHeaderComponent}
      listType="sectionList"
      onEndReached={pours.fetchNextPage}
      onRefresh={pours.refetch}
      renderItem={_renderRow}
      renderSectionHeader={(info: { section: import('react-native').SectionListData<Pour> }) => (
         
        <KegSectionHeader section={info.section as any} />
      )}
       
      sections={kegWithPours as any}
      stickySectionHeadersEnabled
    />
  );
};

export default SectionPoursList;
