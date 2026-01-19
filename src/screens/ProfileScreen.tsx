import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StaticScreenProps } from '@react-navigation/native';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { FRIEND_STATUSES } from '@brewskey/js-api';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import UserAvatar from '../common/avatars/UserAvatar';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import { UserBadges } from '../components/UserBadges/UserBadges';
import Container from '../common/Container';

import { useUserID } from '../stores/AuthStore';
import LoadingIndicator from '../common/LoadingIndicator';
import SectionContent from '../common/SectionContent';
import Header from '../common/Header';
import ProfileFriendStatus from '../components/ProfileFriendStatus';
import { AllBeveragesHScroll } from '../components/Stats/AllBeveragesHScroll';
import FriendsHorizontalList from '../components/FriendsHorizontalList';
import AvatarPicker from '../components/AvatarPicker';
import { useGetAccountById } from '../hooks/queries/AccountQueries';
import { useGetFriendSingle } from '../hooks/queries/FriendQueries';

const styles = StyleSheet.create({
  friendsListSection: {
    height: 194,
  },
});

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const ProfileScreen: React.FC<Props> = ({
  route: {
    params: { id },
  },
}: Props) => {
  const userID = useUserID();

  const { data: account, isLoading: accountLoading } = useGetAccountById(id);
  const { data: friend, isLoading: friendLoading } = useGetFriendSingle({
    filters: [
      createFilter('owningAccount/id').equals(userID),
      createFilter('friendAccount/id').equals(id),
    ],
    take: 1,
  });

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
    return null;
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
      <ScrollView>
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
            />
          </Section>
        ) : (
          <React.Fragment>
            <Section
              bottomPadded
              innerContainerStyle={styles.friendsListSection}
            >
              <SectionHeader title="Friends" />
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
              <SectionHeader title="Badges" />
              <UserBadges userID={account.id} />
            </Section>
            <Section bottomPadded>
              <SectionHeader title="Beverages Poured" />
              <AllBeveragesHScroll userID={account.id} />
            </Section>
          </React.Fragment>
        )}
      </ScrollView>
    </Container>
  );
};

export default withErrorBoundary(ProfileScreen, <ErrorScreen shouldShowBackButton />);
