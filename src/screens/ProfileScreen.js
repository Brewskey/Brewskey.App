// @flow

import type { Account, EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { ScrollView } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import UserAvatar from '../common/avatars/UserAvatar';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import UserBadges from '../components/UserBadges';
import Container from '../common/Container';
import { observer } from 'mobx-react/native';
import { AccountStore } from '../stores/DAOStores';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import SectionContent from '../common/SectionContent';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

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
        loader={AccountStore.getByID(id)}
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

const LoadedComponent = ({ value: account }: LoadedComponentProps) => (
  <Container>
    <Header showBackButton title={account.userName} />
    <ScrollView>
      <Section bottomPadded>
        <SectionContent centered paddedVertical>
          <UserAvatar userName={account.userName} size={200} />
        </SectionContent>
      </Section>
      <Section bottomPadded>
        <SectionHeader title="Badges" />
        <UserBadges userID={account.id} />
      </Section>
    </ScrollView>
  </Container>
);

export default ProfileScreen;
