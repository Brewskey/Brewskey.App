// @flow

import type { Props as TouchableItemProps } from '../../common/buttons/TouchableItem';

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

type Props<TComponentProps> = {|
  icon: { name: string, type?: string },
  iconContainerComponent?: React.AbstractComponent<TComponentProps>,
  isFocused: boolean,
  onPress: (route: Object) => void,
  route: Object,
|};

class TabBarButton<TComponentProps> extends React.PureComponent<
  Props<TComponentProps>,
> {
  static defaultProps: {|
    iconContainerComponent: React.AbstractComponent<TouchableItemProps>,
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
        color={isFocused ? COLORS.primary2 : COLORS.secondary3}
        Component={iconContainerComponent}
        containerStyle={styles.container}
        name={name}
        onPress={this._onPress}
        type={type}
      />
    );
  }
}

export default TabBarButton;
