// @flow

import type { LoaderErrorRowProps } from './LoaderRow';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem as RNEListItem } from 'react-native-elements';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitleStyle: {
    color: COLORS.secondary,
  },
  titleStyle: {
    color: COLORS.secondary,
  },
});

type Props = LoaderErrorRowProps<{|
  containerStyle?: Object,
|}>;

class ErrorListItem<TExtraProps> extends React.PureComponent<Props> {
  render(): React.Node {
    return (
      <RNEListItem
        {...this.props}
        containerStyle={[styles.container, this.props.containerStyle]}
        rightIcon={{ name: 'error' }}
        subtitle="none"
        subtitleStyle={styles.subtitleStyle}
        title="none"
        titleStyle={styles.titleStyle}
      />
    );
  }
}

export default ErrorListItem;
