import * as React from 'react';

import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, StyleSheet, View } from 'react-native';

import { SectionContent } from 'common/SectionContent';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useLoginWithApple } from 'hooks/queries/AuthQueries';
import { isAppleSignInAvailable } from 'utils/appleSignIn';

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: '100%',
  },
});

const AvailableAppleLoginButton = (): React.ReactElement | null => {
  const loginMutator = useLoginWithApple();
  const addSnackBarMessage = useAddSnackBarMessage();

  if (!loginMutator.isReady || !loginMutator.isAvailable) {
    return null;
  }

  const onPress = (): void => {
    if (loginMutator.isPending) {
      return;
    }
    loginMutator.mutate(undefined, {
      onError: (error) => {
        addSnackBarMessage({
          content: error.message || 'Apple sign-in failed.',
          style: 'danger',
        });
      },
    });
  };

  return (
    <SectionContent paddedHorizontal paddedVertical>
      <View testID="apple-login-button-container">
        {Platform.OS === 'web' ? (
          <View style={styles.button} testID="apple-login-button" />
        ) : (
          <AppleAuthentication.AppleAuthenticationButton
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            cornerRadius={3}
            onPress={onPress}
            style={styles.button}
          />
        )}
      </View>
    </SectionContent>
  );
};

const AppleLoginButton = (): React.ReactElement | null => {
  if (Platform.OS !== 'ios' && !isAppleSignInAvailable) {
    return null;
  }

  return <AvailableAppleLoginButton />;
};

export { AppleLoginButton };
