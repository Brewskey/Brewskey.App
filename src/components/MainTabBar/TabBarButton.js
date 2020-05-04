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
  icon: { name: string, type?: string },
  iconContainerComponent?: React.ComponentType<any>,
  isFocused: boolean,
  onPress: (route: Object) => void,
  route: Object,
|};

class TabBarButton extends React.PureComponent<Props> {
  static defaultProps: {|
    iconContainerComponent: React.AbstractComponent<>,
  |} = {
    iconContainerComponent: TouchableItem,
  };

  _onPress = () => this.props.onPress(this.props.route);

  render(): React.Node {
    const {
      icon: { name, type },
      iconContainerComponent,
      isFocused,
    } = this.props;

    return (
      <Icon
        borderless
        color={isFocused ? COLORS.primary2 : COLORS.secondary3}
        component={iconContainerComponent}
        containerStyle={styles.container}
        name={name}
        onPress={this._onPress}
        type={type}
      />
    );
  }
}

export default TabBarButton;
