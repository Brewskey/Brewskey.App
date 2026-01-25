import * as React from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';
import Button from '../../common/buttons/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginForm } from '../../components/LoginForm';
import { COLORS } from '../../theme';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    flex: 1,
  },
  image: {
    height: 100,
    width: 100,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
});

export default function LoginScreen() {
  const router = useRouter();
  const onRegisterPress = () => {
    router.navigate({ pathname: '/(auth)/register', params: {} });
  };

  const onForgotPasswordPress = () => router.navigate({ pathname: '/(auth)/reset-password', params: {} });

  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round(dimensions.width * 0.234);
  const imageWidth =
    dimensions.width - styles.imageContainer.paddingHorizontal * 2;

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.container}
    >
      <StatusBar backgroundColor={COLORS.primary3} />
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          source={require('../../resources/brewskey-large.png')}
          style={{
            height: imageHeight,
            width: imageWidth,
          }}
        />
      </View>
      <LoginForm isInverse />
      <View style={{ paddingTop: 20 }}>
        <Button onPress={onRegisterPress} testID="button-register" title="Register" type="clear" />
        <Button
          onPress={onForgotPasswordPress}
          testID="button-forgot-password"
          title="Forgot password"
          type="clear"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
