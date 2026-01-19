import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import AvatarPicker from '../components/AvatarPicker';
import Container from '../common/Container';
import Header from '../common/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import Section from '../common/Section';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';

const MyProfileScreen: React.FC = () => {
  return (
    <Container>
      <Header shouldShowBackButton title="My profile" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Section bottomPadded>
          <SectionContent centered>
            <AvatarPicker />
          </SectionContent>
        </Section>
        <Section>
          <SectionHeader title="Change password" />
          <ChangePasswordForm onSubmit={async () => {}} />
        </Section>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(MyProfileScreen, <ErrorScreen shouldShowBackButton />);
