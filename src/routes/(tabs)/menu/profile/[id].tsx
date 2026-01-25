import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { FRIEND_STATUSES } from '@brewskey/js-api';

import ErrorScreen from '../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import UserAvatar from '../../../../common/avatars/UserAvatar';
import Section from '../../../../common/Section';
import SectionHeader from '../../../../common/SectionHeader';
import { UserBadges } from '../../../../components/UserBadges/UserBadges';
import Container from '../../../../common/Container';

import { useUserID } from '../../../../hooks/context/AuthContext';
import LoadingIndicator from '../../../../common/LoadingIndicator';
import SectionContent from '../../../../common/SectionContent';
import Header from '../../../../common/Header';
import ProfileFriendStatus from '../../../../components/ProfileFriendStatus';
import { AllBeveragesHScroll } from '../../../../components/Stats/AllBeveragesHScroll';
import FriendsHorizontalList from '../../../../components/FriendsHorizontalList';
import AvatarPicker from '../../../../components/AvatarPicker';
import { useGetAccountById } from '../../../../hooks/queries/AccountQueries';
import { useGetFriendSingle } from '../../../../hooks/queries/FriendQueries';

const styles = StyleSheet.create({
  friendsListSection: {
    height: 194,
  },
});

const ProfileScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profileId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const userID = useUserID();

  const { data: account, isLoading: accountLoading } = useGetAccountById(profileId as EntityID);
  const { data: friend, isLoading: friendLoading } = useGetFriendSingle({
    filters: [
      createFilter('owningAccount/id').equals(userID),
      createFilter('friendAccount/id').equals(profileId),
    ],
    take: 1,
  });

  const isLoading = accountLoading || friendLoading;

  if (isLoading || account == null) {
    return (
      <Container>
        <Header shouldShowBackButton />
        <LoadingIndicator testID="profile-loading" />
      </Container>
    );
  }

  return (
    <Container>
      <Header
        rightComponent={
          <ProfileFriendStatus account={account} friend={friend ?? null} />
        }
        shouldShowBackButton
        title={account.userName}
      />
      <ScrollView testID="profile-content">
        <Section bottomPadded>
          <SectionContent centered paddedVertical>
            {userID === account.id ? (
              <AvatarPicker />
            ) : (
              <UserAvatar userName={account.userName} size={200} />
            )}
          </SectionContent>
        </Section>
        {userID !== account.id &&
        (!friend || friend.friendStatus !== FRIEND_STATUSES.APPROVED) ? (
          <Section>
            <SectionHeader
              title={`You aren't friends with ${account.userName}`}
              testID="section-header-not-friends"
            />
          </Section>
        ) : (
          <React.Fragment>
            <Section
              bottomPadded
              innerContainerStyle={styles.friendsListSection}
            >
              <SectionHeader title="Friends" testID="section-header-friends" />
              <FriendsHorizontalList
                queryOptions={{
                  filters: [
                    createFilter('owningAccount/id').equals(account.id),
                    createFilter('friendStatus').equals(
                      FRIEND_STATUSES.APPROVED,
                    ),
                  ],
                }}
              />
            </Section>
            <Section bottomPadded>
              <SectionHeader title="Badges" testID="section-header-badges" />
              <UserBadges userID={account.id} />
            </Section>
            <Section bottomPadded>
              <SectionHeader title="Beverages Poured" testID="section-header-beverages-poured" />
              <AllBeveragesHScroll userID={account.id} />
            </Section>
          </React.Fragment>
        )}
      </ScrollView>
    </Container>
  );
};

export default withErrorBoundary(ProfileScreen, <ErrorScreen shouldShowBackButton />);
