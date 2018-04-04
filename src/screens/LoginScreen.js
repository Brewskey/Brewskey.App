// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Button from '../common/buttons/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BrewskeyLogo from '../resources/brewskey-large.png';
import LoginForm from '../components/LoginForm';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 150,
    paddingHorizontal: 40,
  },
});

type Props = {|
  navigation: Navigation,
|};

@errorBoundary(ErrorScreen)
class LoginScreen extends React.Component<Props> {
  _onRegisterPress = () => this.props.navigation.navigate('register');

  _onForgotPasswordPress = () =>
    this.props.navigation.navigate('resetPassword');

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary3} />
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={BrewskeyLogo}
            style={styles.image}
          />
        </View>
        <LoginForm />
        <Button onPress={this._onRegisterPress} title="Register" transparent />
        <Button
          onPress={this._onForgotPasswordPress}
          title="Forgot password"
          transparent
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default LoginScreen;
