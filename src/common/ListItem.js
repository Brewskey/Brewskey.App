// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem as RNEListItem } from 'react-native-elements';

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    backgroundColor: 'white',
  },
});

type Props<TItem> = {
  containerStyle?: Object,
  item: TItem,
  onPress: (item: TItem) => void,
  // other react-native=elements ListItemProps
};

class ListItem<TItem> extends React.PureComponent<Props<TItem>> {
  static defaultProps = {
    onPress: () => {},
  };

  _onPress = (): void => this.props.onPress(this.props.item);

  render() {
    return (
      <RNEListItem
        {...this.props}
        containerStyle={[styles.container, this.props.containerStyle]}
        onPress={this._onPress}
      />
    );
  }
}

export default ListItem;
