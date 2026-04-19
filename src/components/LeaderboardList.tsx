import * as React from 'react';

import { useRouter } from 'expo-router';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { List } from 'common/List';
import { ListEmpty } from 'common/ListEmpty';
import { ListItem } from 'common/ListItem';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { PintCounter } from 'components/PintCounter';
import { useGetTapLeaderboard } from 'hooks/queries/TapQueries';

import type { EntityID, LeaderboardItem } from '@brewskey/js-api';

import type { ListComponentTypes } from 'common/List';
import type { LeaderboardDurationValue } from 'components/LeaderboardDurationPicker';

interface Props {
  duration: LeaderboardDurationValue;
  ListHeaderComponent?: ListComponentTypes;
  tapID: EntityID;
}

export const LeaderboardList: React.FC<Props> = ({
  tapID,
  duration,
  ListHeaderComponent,
}) => {
  const leaderboard = useGetTapLeaderboard(tapID, duration);
  const router = useRouter();

  const _keyExtractor = (item: LeaderboardItem): string =>
    item.userName || item.lastPourDate.toString();

  const _onItemPress = ({ userID }: LeaderboardItem) => {
    if (!userID) {
      return;
    }
    router.navigate({
      pathname: '/profile/[id]',
      params: { id: String(userID) },
    });
  };

  const _renderRow = ({
    item,
    index,
  }: {
    item: LeaderboardItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      item={item}
      leftAvatar={<UserAvatar userName={item.userName || ''} />}
      onPress={item.userID ? _onItemPress : undefined}
      rightIcon={<PintCounter beverageID={null} ounces={item.totalOunces} />}
      subtitle={`${item.totalOunces.toFixed(1)} oz`}
      title={`${index + 1}. ${item.userName || ''}`}
    />
  );

  return (
    <List
      data={leaderboard.data}
      keyExtractor={_keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      listType="flatList"
      onEndReached={leaderboard.fetchNextPage}
      onRefresh={() => {
        void leaderboard.refetch();
      }}
      renderItem={_renderRow}
      testID="leaderboard-list"
      ListEmptyComponent={
        !leaderboard.isLoading ? (
          <ListEmpty message="There is nobody on the leaderboard for selected period!" />
        ) : null
      }
      ListFooterComponent={
        <LoadingListFooter isLoading={leaderboard.isLoading} />
      }
    />
  );
};
