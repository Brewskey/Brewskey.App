import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Icon } from '@rneui/themed';
import Container from './Container';
import Header from './Header';
import Fragment from './Fragment';
import { COLORS, TYPOGRAPHY } from '../theme';

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

type Props = {
  shouldShowBackButton?: boolean;
  title: string;
  message: string;
};

const NotFoundScreen = ({ shouldShowBackButton = true, title, message }: Props): React.ReactElement => (
  <Fragment>
    <Header shouldShowBackButton={shouldShowBackButton} title={title} />
    <Container centered style={styles.container}>
      <Icon
        reverse
        reverseColor={COLORS.accent}
        color={COLORS.secondary2}
        name="error-outline"
        size={45}
      />
      <Text style={styles.text}>{message}</Text>
    </Container>
  </Fragment>
);

export default NotFoundScreen;
