import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../common/buttons/Button';
import { COLORS, TYPOGRAPHY } from '../../../theme';
import { WIFI_SECURITIES } from '../../../SoftApService';
import { Icon } from '@rneui/themed';
import { TextField } from '../../../common/form/TextField';
import { FormValidationMessage } from '../../../common/form/FormValidationMessage';
import { Form } from '../../../common/form/Form';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondary2,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  iconStyle: {
    marginLeft: 'auto',
  },
  labelContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  title: {
    ...TYPOGRAPHY.secondary,
  },
});

type Props = {
  error: Error | null | undefined;
  index: number;
  isConnecting: boolean;
  isExpanded: boolean;
  item: WifiNetwork;
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>;
  onPress: (rowKey: string) => void;
  rowKey: string;
};

class WifiListItem extends React.Component<Props> {
  _password = '';

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

  render(): React.ReactElement {
    const {
      isConnecting,
      isExpanded,
      item: { ssid, security },
    } = this.props;

    const isPasswordRequired = security !== WIFI_SECURITIES.OPEN;

    return (
      <TouchableOpacity
        disabled={isExpanded}
        onPress={this._onPress}
        style={styles.container}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.title}>{ssid}</Text>
          {isPasswordRequired && (
            <Icon containerStyle={styles.iconStyle} name="lock" />
          )}
        </View>
        {isExpanded && [
          isPasswordRequired && (
            <TextField
              editable={!isConnecting}
              key="password"
              label="Password"
              onSubmitEditing={this._onConnectPress}
              secureTextEntry
              name="password"
            />
          ),
          <FormValidationMessage fieldName="wifiSetupError" />,
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
