// @flow

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react/native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import AvatarPicker from '../components/AvatarPicker';
import Container from '../common/Container';
import Header from '../common/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import Section from '../common/Section';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';
import FriendsHorizontalList from '../components/FriendsHorizontalList';
import DAOApi, { FRIEND_STATUSES } from 'brewskey.js-api';
import AuthStore from '../stores/AuthStore';

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class MyProfileScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header showBackButton title="My profile" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Section bottomPadded>
            <SectionContent centered>
              <AvatarPicker />
            </SectionContent>
          </Section>
          <Section bottomPadded>
            <SectionHeader title="Friends" />
            <FriendsHorizontalList
              queryOptions={{
                filters: [
                  DAOApi.createFilter('owningAccount/id').equals(
                    AuthStore.userID,
                  ),
                  DAOApi.createFilter('friendStatus').equals(
                    FRIEND_STATUSES.APPROVED,
                  ),
                ],
              }}
            />
          </Section>
          <Section>
            <SectionHeader title="Change password" />
            <ChangePasswordForm />
          </Section>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default MyProfileScreen;
