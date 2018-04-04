// @flow

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react/native';
import AvatarPicker from '../components/AvatarPicker';
import Container from '../common/Container';
import Header from '../common/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import Section from '../common/Section';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';

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
