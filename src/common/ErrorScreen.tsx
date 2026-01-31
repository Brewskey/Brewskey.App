import { Icon } from '@rneui/themed';
import { StyleSheet, Text } from 'react-native';

import { Container } from 'common/Container';
import { Fragment } from 'common/Fragment';
import { Header } from 'common/Header';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { ReactElement } from 'react';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

interface Props {
  shouldShowBackButton?: boolean;
}

const ErrorScreen = ({ shouldShowBackButton }: Props): ReactElement => (
  <Fragment>
    <Header
      shouldShowBackButton={shouldShowBackButton}
      title="Whoops! Error!"
    />
    <Container centered style={styles.container}>
      <Icon
        reverse
        color={COLORS.secondary2}
        name="priority-high"
        reverseColor={COLORS.accent}
        size={45}
      />
      <Text style={styles.text}>
        Whoa! Brewskey had an error. We&apos;ll try to get it fixed soon.
      </Text>
    </Container>
  </Fragment>
);

export { ErrorScreen };
