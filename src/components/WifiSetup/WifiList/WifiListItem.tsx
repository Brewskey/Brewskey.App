import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../common/buttons/Button';
import { COLORS, TYPOGRAPHY } from '../../../theme';
import { WIFI_SECURITIES } from '../../../SoftApService';
import { Icon } from '@rneui/themed';
import { TextField } from '../../../common/form/TextField';
import { FormValidationMessage } from '../../../common/form/FormValidationMessage';
import { useFormContext } from 'react-hook-form';

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

const WifiListItem: React.FC<Props> = ({
  index,
  isConnecting,
  isExpanded,
  item,
  onConnectPress,
  onPress,
  rowKey,
}) => {
  const form = useFormContext();
  const password = form.watch(`password_${rowKey}`) || '';

  const handleConnectPress = React.useCallback(() => {
    onConnectPress({
      ...item,
      index,
      password,
    });
  }, [index, item, onConnectPress, password, rowKey]);

  const handlePress = React.useCallback(() => {
    onPress(rowKey);
  }, [onPress, rowKey]);

  const { ssid, security } = item;
  const isPasswordRequired = security !== WIFI_SECURITIES.OPEN;

  return (
    <TouchableOpacity
      disabled={isExpanded}
      onPress={handlePress}
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
            onSubmitEditing={handleConnectPress}
            secureTextEntry
            name={`password_${rowKey}`}
          />
        ),
        <FormValidationMessage fieldName="wifiSetupError" />,
        <Button
          disabled={isConnecting}
          key="connectButton"
          onPress={handleConnectPress}
          title="Connect"
        />,
      ]}
    </TouchableOpacity>
  );
};

export default WifiListItem;
