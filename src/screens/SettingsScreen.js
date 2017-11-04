// @flow

import type { Navigation } from '../types';
import type AppSettingsStore from '../stores/AppSettingsStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { List, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type InjectedProps = {|
  navigation: Navigation,
  appSettingsStore: AppSettingsStore,
|};

@inject('appSettingsStore')
@observer
class SettingsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Settings',
  };

  render(): React.Node {
    return (
      <List>
        <KeyboardAwareScrollView>
          <ListItem
            title="Multi account mode"
            hideChevron
            onSwitch={
              this.injectedProps.appSettingsStore.toggleMultiAccountMode
            }
            switchButton
            switched={
              this.injectedProps.appSettingsStore.multiAccountModeEnabled
            }
          />
          <ListItem
            hideChevron
            onSwitch={this.injectedProps.appSettingsStore.toggleManageTaps}
            switchButton
            switched={this.injectedProps.appSettingsStore.manageTapsEnabled}
            title="Manage taps"
          />
        </KeyboardAwareScrollView>
      </List>
    );
  }
}

export default SettingsScreen;
