import type { EntityID, LeaderboardItem } from '@brewskey/js-api';

import * as React from 'react';

import List, { ListComponentTypes } from '../common/List';

import LoadingListFooter from '../common/LoadingListFooter';
import PintCounter from '../components/PintCounter';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import ListEmpty from '../common/ListEmpty';
import { useGetTapLeaderboard } from '../hooks/queries/TapQueries';
import { LeaderboardDurationValue } from './LeaderboardDurationPicker';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type Props = {
  duration: LeaderboardDurationValue;
  ListHeaderComponent?: ListComponentTypes;
  tapID: EntityID;
};

export const LeaderboardList: React.FC<Props> = ({
  tapID,
  duration,
  ListHeaderComponent,
}) => {
  const leaderboard = useGetTapLeaderboard(tapID, duration);
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const _keyExtractor = (item: LeaderboardItem): string => {
    return item.userName || item.lastPourDate.toString();
  };

  const _onItemPress = ({ userID }: LeaderboardItem) => {
    if (!userID) return;
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'profile',
        params: {
          id: userID,
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };

  const _renderRow = ({
    item,
    index,
  }: {
    item: LeaderboardItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      leftAvatar={<UserAvatar userName={item.userName || ''} />}
      item={item}
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
      ListEmptyComponent={
        !leaderboard.isLoading ? (
          <ListEmpty message="There is nobody on the leaderboard for selected period!" />
        ) : null
      }
      ListFooterComponent={
        <LoadingListFooter isLoading={leaderboard.isLoading} />
      }
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={leaderboard.fetchNextPage}
      onRefresh={leaderboard.refetch}
      renderItem={_renderRow}
    />
  );
};

export default LeaderboardList;
