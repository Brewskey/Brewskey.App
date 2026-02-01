import * as React from 'react';

import { FRIEND_STATUSES } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { AvatarPicker } from 'components/AvatarPicker';
import { FriendsHorizontalList } from 'components/FriendsHorizontalList';
import { ProfileFriendStatus } from 'components/ProfileFriendStatus';
import { AllBeveragesHScroll } from 'components/Stats/AllBeveragesHScroll';
import { UserBadges } from 'components/UserBadges/UserBadges';
import { useUserID } from 'hooks/context/AuthContext';
import { useGetAccountById } from 'hooks/queries/AccountQueries';
import { useGetFriendSingle } from 'hooks/queries/FriendQueries';

import type { EntityID } from '@brewskey/js-api';

const styles = StyleSheet.create({
  friendsListSection: {
    height: 194,
  },
});

const ProfileScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profileId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const userID = useUserID();

  const { data: account, isLoading: accountLoading } = useGetAccountById(
    profileId as EntityID,
  );
  const { data: friend, isLoading: friendLoading } = useGetFriendSingle({
    filters: [
      createFilter('owningAccount/id').equals(userID),
      createFilter('friendAccount/id').equals(profileId),
    ],
    take: 1,
  });

  if (!profileId) {
    return (
      <NotFoundScreen
        message="The profile you're looking for could not be found."
        title="Profile Not Found"
      />
    );
  }

  const isLoading = accountLoading || friendLoading;

  if (isLoading) {
    return (
      <Container>
        <Header shouldShowBackButton />
        <LoadingIndicator />
      </Container>
    );
  }

  if (account == null) {
    return (
      <NotFoundScreen
        message="The profile you're looking for could not be found."
        title="Profile Not Found"
      />
    );
  }

  return (
    <Container>
      <Header
        shouldShowBackButton
        testID="header-profile"
        title={account.userName}
        rightComponent={
          <ProfileFriendStatus account={account} friend={friend ?? null} />
        }
      />
      <ScrollView testID="profile-content">
        <Section bottomPadded>
          <SectionContent centered paddedVertical>
            {userID === account.id ? (
              <AvatarPicker />
            ) : (
              <UserAvatar size={200} userName={account.userName} />
            )}
          </SectionContent>
        </Section>
        {userID !== account.id &&
        friend?.friendStatus !== FRIEND_STATUSES.APPROVED ? (
          <Section>
            <SectionHeader
              testID="section-header-not-friends"
              title={`You aren't friends with ${account.userName}`}
            />
          </Section>
        ) : (
          <React.Fragment>
            <Section
              bottomPadded
              innerContainerStyle={styles.friendsListSection}
            >
              <SectionHeader testID="section-header-friends" title="Friends" />
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
              <SectionHeader testID="section-header-badges" title="Badges" />
              <UserBadges userID={account.id} />
            </Section>
            <Section bottomPadded>
              <SectionHeader
                testID="section-header-beverages-poured"
                title="Beverages Poured"
              />
              <AllBeveragesHScroll userID={account.id} />
            </Section>
          </React.Fragment>
        )}
      </ScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  ProfileScreen,
  <ErrorScreen shouldShowBackButton />,
);
