// @flow

import * as React from 'react';
import { Linking, Text, StyleSheet } from 'react-native';
import SimplePicker from '../pickers/SimplePicker';
import { COLORS, TYPOGRAPHY } from '../../theme';
import SnackBarStore from '../../stores/SnackBarStore';

type Props = {|
  error?: string,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const DeviceTimeOpenPicker = (props: Props) => (
  <SimplePicker
    description={DESCRIPTION_BY_VALUE[props.value]}
    doesRequireConfirmation={false}
    headerTitle="Select NFC Configuration"
    label="NFC Configuration"
    onChange={props.onChange}
    pickerValues={[
      { label: 'Phone Only', value: 'PhoneOnly' },
      { label: 'Card Only', value: 'CardOnly' },
      { label: 'Phone And Card', value: 'PhoneAndCard' },
      { label: 'Disabled', value: 'Disabled' },
    ]}
    value={props.value}
  />
);

const LEARN_MORE_LINK = 'https://brewskey.com/faq#supported-nfc-cards';
const callback = () => {
  Linking.canOpenURL(LEARN_MORE_LINK).then(supported => {
    if (supported) {
      Linking.openURL(LEARN_MORE_LINK);
    } else {
      SnackBarStore.showMessage({
        style: 'danger',
        text: `Could not open link ${LEARN_MORE_LINK}.`,
      });
    }
  });
};

const CardComponent = () => (
  <React.Fragment>
    <Text style={styles.descriptionText}>
      The Brewskey box can be unlocked by tapping a NFC card. Mobile phone NFC
      will not work.
    </Text>
    <Text onPress={callback} style={[styles.descriptionText, styles.linkText]}>
      See compatible cards and learn more here
    </Text>
  </React.Fragment>
);

const PhoneAndCardComponent = () => (
  <React.Fragment>
    <Text style={[styles.descriptionText, { fontWeight: 'bold' }]}>
      THIS CONFIGURATION DOES NOT WORK WELL FOR ANDROID PHONES.
    </Text>
    <Text style={styles.descriptionText}>
      The Brewskey box can be unlocked by tapping your phone or card.
    </Text>
    <Text onPress={callback} style={[styles.descriptionText, styles.linkText]}>
      See compatible cards and learn more here
    </Text>
  </React.Fragment>
);

const styles = StyleSheet.create({
  descriptionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  linkText: { color: '#007bff', textDecorationLine: 'underline' },
});

const DESCRIPTION_BY_VALUE = {
  CardOnly: <CardComponent />,
  Disabled: (
    <Text style={[styles.descriptionText]}>
      NFC is turned off on the Brewskey box.
    </Text>
  ),
  PhoneAndCard: <PhoneAndCardComponent />,
  PhoneOnly: (
    <Text style={[styles.descriptionText]}>
      The Brewskey box can be unlocked by tapping your phone. NFC cards will not
      work.
    </Text>
  ),
};

export default DeviceTimeOpenPicker;
