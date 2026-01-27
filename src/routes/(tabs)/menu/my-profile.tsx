import * as React from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../common/ErrorScreen';
import { Header } from '../../../common/Header';
import { Section } from '../../../common/Section';
import { SectionContent } from '../../../common/SectionContent';
import { SectionHeader } from '../../../common/SectionHeader';
import { AvatarPicker } from '../../../components/AvatarPicker';
import { ChangePasswordForm } from '../../../components/ChangePasswordForm';

const MyProfileScreen: React.FC = () => (
  <Container>
    <Header
      shouldShowBackButton
      testID="header-my-profile"
      title="My profile"
    />
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      testID="my-profile-content"
    >
      <Section bottomPadded>
        <SectionContent centered>
          <AvatarPicker />
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader
          testID="section-header-change-password"
          title="Change password"
        />
        <ChangePasswordForm onSubmit={async () => {}} />
      </Section>
    </KeyboardAwareScrollView>
  </Container>
);

export default withErrorBoundary(
  MyProfileScreen,
  <ErrorScreen shouldShowBackButton />,
);
