// @flow

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, SwipeRow } from 'native-base';

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
  },
});

type Props<TEntity> = {|
  item: TEntity,
  onDeleteItemPress: (id: string) => void,
  onItemPress: (id: string) => void,
|};

class SwipeListItem<TEntity> extends React.Component<Props<TEntity>> {
  _onDeleteButtonPress = (): void =>
    this.props.onDeleteButtonPress(this.props.item.id);

  _onItemPress = (): void => this.props.onItemPress(this.props.item.id);

  render(): React.Element<*> {
    return (
      <SwipeRow
        body={
          <View style={styles.listItemContainer}>
            <TouchableOpacity onPress={this._onItemPress}>
              <Text>{this.props.item.name}</Text>
            </TouchableOpacity>
          </View>
        }
        disableRightSwipe
        right={
          <Button danger onPress={this._onDeleteButtonPress}>
            <Icon active name="trash" />
          </Button>
        }
        rightOpenValue={-75}
      />
    );
  }
}

export default SwipeListItem;
