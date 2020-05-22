// @flow

import type { Style } from '../types';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem as RNEListItem } from 'react-native-elements';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitle: { color: COLORS.textFaded },
  title: { color: COLORS.text },
});

type Props<TItem> = {|
  ...React.ElementProps<typeof RNEListItem>,
  containerStyle?: Style,
  item: TItem,
  onPress: (item: TItem) => void,
|};

class ListItem<TItem> extends React.PureComponent<Props<TItem>> {
  static defaultProps: {| onPress: (TItem) => void |} = {
    onPress: () => {},
  };

  _onPress = (): void => this.props.onPress(this.props.item);

  render(): React.Node {
    const { item: _1, onPress: _2, ...otherProps } = this.props;
    return (
      <RNEListItem
        {...otherProps}
        containerStyle={[styles.container, this.props.containerStyle]}
        onPress={this._onPress}
        subtitleStyle={styles.subtitle}
        titleStyle={styles.title}
        bottomDivider
      />
    );
  }
}

export default ListItem;
