// @flow

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { List, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

@inject('appSettingsStore')
@observer
class SettingsScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Settings',
  };

  render(): React.Element<*> {
    return (
      <List>
        <KeyboardAwareScrollView>
          <ListItem
            title="Multi account mode"
            hideChevron
            onSwitch={this.props.appSettingsStore.toggleMultiAccountMode}
            switchButton
            switched={this.props.appSettingsStore.multiAccountModeEnabled}
          />
          <ListItem
            hideChevron
            onSwitch={this.props.appSettingsStore.toggleManageTaps}
            switchButton
            switched={this.props.appSettingsStore.manageTapsEnabled}
            title="Manage taps"
          />
        </KeyboardAwareScrollView>
      </List>
    );
  }
}

export default SettingsScreen;
