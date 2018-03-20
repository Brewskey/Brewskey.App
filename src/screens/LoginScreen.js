// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
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
    maxHeight: 200,
    paddingHorizontal: 35,
    // paddingVertical: 25,
  },
});

type Props = {|
  navigation: Navigation,
|};

class LoginScreen extends React.Component<Props> {
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
      </KeyboardAwareScrollView>
    );
  }
}

export default LoginScreen;
