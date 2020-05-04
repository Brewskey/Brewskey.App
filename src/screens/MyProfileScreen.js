// @flow

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import AvatarPicker from '../components/AvatarPicker';
import Container from '../common/Container';
import Header from '../common/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import Section from '../common/Section';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class MyProfileScreen extends React.Component<{}> {
  render(): React.Node {
    return (
      <Container>
        <Header showBackButton title="My profile" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Section bottomPadded>
            <SectionContent centered>
              <AvatarPicker />
            </SectionContent>
          </Section>
          <Section>
            <SectionHeader title="Change password" />
            <ChangePasswordForm onSubmit={() => {}} />
          </Section>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default MyProfileScreen;
