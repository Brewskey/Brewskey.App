// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';
import AuthApi from '../AuthApi';
import Header from '../common/Header';
import ToggleStore from '../stores/ToggleStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SectionContent from '../common/SectionContent';
import Container from '../common/Container';
import ResetPasswordModal from '../components/modals/ResetPasswordModal';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
    textAlign: 'center',
  },
});

type Props = {|
  navigation: Navigation,
|};

@observer
class ResetPasswordScreen extends React.Component<Props> {
  _modalToggleStore: ToggleStore = new ToggleStore();

  _onFormSubmit = async (): Promise<void> => {
    await AuthApi.resetPassword();
    this._modalToggleStore.toggleOn();
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Reset password" />
        <SectionContent paddedHorizontal paddedVertical>
          <Text style={styles.text}>
            Enter your email address and we'll send a password reset email to
            you.
          </Text>
        </SectionContent>
        <KeyboardAwareScrollView>
          <ResetPasswordForm onSubmit={this._onFormSubmit} />
          <ResetPasswordModal
            isVisible={this._modalToggleStore.isToggled}
            onHideModal={this._modalToggleStore.toggleOff}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default ResetPasswordScreen;
