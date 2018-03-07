// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableItem from '../../common/buttons/TouchableItem';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

type Props = {|
  icon: { name: string, type: string },
  index: number,
  isFocused: boolean,
  onPress: (index: number) => void,
|};

class TabBarButton extends React.PureComponent<Props> {
  _onPress = () => this.props.onPress(this.props.index);

  render() {
    const { icon: { name, type }, isFocused } = this.props;

    return (
      <Icon
        borderless
        color={isFocused ? COLORS.primary2 : COLORS.secondary3}
        component={TouchableItem}
        containerStyle={styles.container}
        name={name}
        onPress={this._onPress}
        type={type}
      />
    );
  }
}

export default TabBarButton;