// @flow

import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Button from '../../../common/buttons/Button';
import TextField from '../../../components/TextField';
import { COLORS, TYPOGRAPHY } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondary2,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  title: {
    ...TYPOGRAPHY.secondary,
    paddingHorizontal: 18,
  },
});

type Props = {|
  index: number,
  isConnection: boolean,
  isExpanded: boolean,
  item: WifiNetwork,
  onConnectPress: (wifiNetwork: WifiNetwork) => void,
  onPress: (rowKey: string) => void,
  wifiSetupLoader: LoadObject<void>,
|};

@observer
class WifiListItem extends React.Component<Props> {
  @observable _password = '';

  @action
  _onPasswordChange = (password: string) => {
    this._password = password;
  };

  _onConnectPress = () => {
    const { index, item, onConnectPress } = this.props;
    onConnectPress({
      ...item,
      index,
      password: this._password,
    });
  };

  _onPress = () => this.props.onPress(this.props.rowKey);

  render() {
    const { isConnecting, isExpanded, item: { ssid } } = this.props;

    return (
      <TouchableOpacity
        disabled={isExpanded}
        onPress={this._onPress}
        style={styles.container}
      >
        <Text style={styles.title}>{ssid}</Text>
        {isExpanded && [
          <TextField
            disabled={isConnecting}
            key="password"
            label="Password"
            onChange={this._onPasswordChange}
            onSubmitEditing={this._onConnectPress}
            value={this._password}
          />,
          <Button
            disabled={isConnecting}
            key="connectButton"
            onPress={this._onConnectPress}
            title="Connect"
          />,
        ]}
      </TouchableOpacity>
    );
  }
}

export default WifiListItem;
