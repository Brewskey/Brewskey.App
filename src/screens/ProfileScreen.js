// @flow

import type { Account, EntityID, Friend } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import UserAvatar from '../common/avatars/UserAvatar';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import UserBadges from '../components/UserBadges';
import Container from '../common/Container';
import { observer } from 'mobx-react/native';
import { AccountStore, FriendStore } from '../stores/DAOStores';
import AuthStore from '../stores/AuthStore';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import SectionContent from '../common/SectionContent';
import Header from '../common/Header';
import ProfileFriendStatus from '../components/ProfileFriendStatus';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import FriendsHorizontalList from '../components/FriendsHorizontalList';
import DAOApi, { FRIEND_STATUSES, LoadObject } from 'brewskey.js-api';

const styles = StyleSheet.create({
  friendsListSection: {
    height: 194,
  },
});

/* eslint-disable sorting/sort-object-props */
type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class ProfileScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { id } = this.injectedProps;
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={LoadObject.merge([
          AccountStore.getByID(id),
          FriendStore.getMany({
            filters: [
              DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
              DAOApi.createFilter('friendAccount/id').equals(id),
            ],
            limit: 1,
          }).map(
            (loaders: Array<LoadObject<Friend>>): LoadObject<Friend> =>
              loaders[0] || LoadObject.empty(),
          ),
        ])}
        loadingComponent={LoadingComponent}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {|
  value: Account,
|};

const LoadedComponent = ({
  value: [account, friend],
}: LoadedComponentProps) => (
  <Container>
    <Header
      rightComponent={<ProfileFriendStatus account={account} friend={friend} />}
      showBackButton
      title={account.userName}
    />
    <ScrollView>
      <Section bottomPadded>
        <SectionContent centered paddedVertical>
          <UserAvatar friend={friend} userName={account.userName} size={200} />
        </SectionContent>
      </Section>
      {AuthStore.userID !== account.id &&
      (!friend || friend.friendStatus !== FRIEND_STATUSES.APPROVED) ? (
        <Section>
          <SectionHeader
            title={`You aren't friends with ${account.userName}`}
          />
        </Section>
      ) : (
        <React.Fragment>
          <Section bottomPadded innerContainerStyle={styles.friendsListSection}>
            <SectionHeader title="Friends" />
            <FriendsHorizontalList
              queryOptions={{
                filters: [
                  DAOApi.createFilter('owningAccount/id').equals(account.id),
                  DAOApi.createFilter('friendStatus').equals(
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
        </React.Fragment>
      )}
    </ScrollView>
  </Container>
);

export default ProfileScreen;
