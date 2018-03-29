// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react/native';
import AvatarPicker from '../components/AvatarPicker';
import Container from '../common/Container';
import Header from '../common/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

@observer
class MyProfileScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header showBackButton title="My profile" />
        <KeyboardAwareScrollView>
          <Section bottomPadded>
            <View style={styles.avatarContainer}>
              <AvatarPicker />
            </View>
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
