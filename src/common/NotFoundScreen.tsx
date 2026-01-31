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
  title: string;
  message: string;
}

const NotFoundScreen = ({
  shouldShowBackButton = true,
  title,
  message,
}: Props): ReactElement => (
  <Fragment>
    <Header shouldShowBackButton={shouldShowBackButton} title={title} />
    <Container centered style={styles.container}>
      <Icon
        reverse
        color={COLORS.secondary2}
        name="error-outline"
        reverseColor={COLORS.accent}
        size={45}
      />
      <Text style={styles.text}>{message}</Text>
    </Container>
  </Fragment>
);

export { NotFoundScreen };
