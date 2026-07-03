import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";

import { Button } from 'common/buttons/Button';
import { SectionContent } from 'common/SectionContent';
import { useLoginWithGoogle } from 'hooks/queries/AuthQueries';
import { COLORS, getElevationStyle } from 'theme';
import { isGoogleSignInConfigured } from 'utils/googleSignInConfig';

const styles = StyleSheet.create({
  // `marginHorizontal: 0` overrides the 20px margin the shared `Button` bakes
  // into its `buttonStyle` so we match the full width of the `Log in` submit
  // button above (which uses RNE Button directly).
  //
  // `height` and `borderRadius` match the native Apple auth button so both
  // social sign-in actions read as one visual group.
  button: {
    borderRadius: 3,
    height: 44,
    marginHorizontal: 0,
  },
  logo: {
    marginRight: 10,
  },
  // Shadow/elevation lives on an outer wrapper View rather than on the Button.
  // RNE's Button renders its `buttonStyle` onto an inner pressable that's
  // wrapped by other Views (and on web becomes a `<button>`), which clips or
  // swallows the shadow. Applying elevation to a plain View above it matches
  // the approach used by `common/Section.tsx` and reliably renders across
  // iOS, Android and web. `shadowColor` is set explicitly (getElevationStyle
  // omits it) so react-native-web always emits a `box-shadow` rule.
  //
  // `borderRadius` here matches RNE's default Button radius (3) so the shadow
  // follows the rounded corners instead of leaking out of a square bounding
  // box.
  shadowWrapper: {
    borderRadius: 3,
    shadowColor: '#000',
    ...getElevationStyle(4),
  },
  title: {
    color: '#000',
    fontSize: 17,
    fontWeight: 500,
  },
});

/**
 * "Sign in with Google" button, styled to match the rest of the app's buttons
 * (`common/buttons/Button`) rather than either Google's own `GoogleSigninButton`
 * widget on native or a web-only branded `<Pressable>`. A single cross-platform
 * implementation is fine here because the platform-specific work lives in
 * `useGoogleSignIn` (web: `expo-auth-session`, native:
 * `@react-native-google-signin/google-signin`).
 *
 * Themed with a white background and black text to match the native Apple
 * sign-in button shown beside it.
 *
 * The Google "G" glyph is rendered from `MaterialCommunityIcons` imported
 * directly from `react-native-vector-icons` rather than via RNE's `Icon`
 * wrapper. RNE's Icon wraps the glyph in a pressable on web, which
 * react-native-web renders as a nested `<button>` element — invalid HTML
 * inside the outer Button's `<button>`. Using the raw font icon avoids that
 * and renders as a plain `<Text>` span.
 *
 * It is single-color rather than the multi-color brand mark, but Google's
 * branding guidelines do explicitly allow a monochromatic "G" on light
 * buttons.
 */
const GoogleLoginButton = (): React.ReactElement | null => {
  const loginMutator = useLoginWithGoogle();

  if (!isGoogleSignInConfigured()) {
    return null;
  }

  const onPress = (): void => {
    loginMutator.mutate(undefined, {
      onError: (error) => {
        // Rethrow on the next tick so the error escapes React Query's
        // promise chain and is picked up by React Native's global error
        // handler, which surfaces it as a LogBox / red-box error in the
        // Expo dev UI with the full stack — much more useful than a
        // truncated snackbar while debugging native Google sign-in.
        setTimeout(() => {
          throw error;
        }, 0);
      },
    });
  };

  const icon = (
    <MaterialCommunityIcons
      color="#000"
      name="google"
      size={14}
      style={styles.logo}
    />
  );

  return (
    <SectionContent paddedHorizontal paddedVertical>
      <View style={styles.shadowWrapper} testID="google-login-button-container">
        <Button
          backgroundColor={COLORS.secondary}
          color="#000"
          disabled={!loginMutator.isReady}
          icon={icon}
          iconPosition="left"
          loading={loginMutator.isPending}
          onPress={onPress}
          style={styles.button}
          testID="google-login-button"
          title="Sign in with Google"
          titleStyle={styles.title}
        />
      </View>
    </SectionContent>
  );
};

export { GoogleLoginButton };
