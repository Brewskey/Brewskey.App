// @flow

import * as React from 'react';
import DrawerButton from './DrawerButton';

type Props = {
  icon: { name: string, type?: string },
  isActive: boolean,
  navigationRoute: ?Object,
  onPress: ({ focused: boolean, route: Object }) => void,
  routeKey: string,
  // other RNEButton Props
};

class NavigationDrawerButton extends React.PureComponent<Props> {
  // delegate navigation logic to react-navigation lib
  _onPress = () => {
    const { navigationRoute, onPress, isActive } = this.props;
    if (navigationRoute) {
      onPress({ focused: isActive, route: navigationRoute });
    }
  };

  render() {
    return <DrawerButton {...this.props} onPress={this._onPress} />;
  }
}

export default NavigationDrawerButton;
