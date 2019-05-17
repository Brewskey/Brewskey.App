// @flow

import * as React from 'react';
import SimplePicker from '../pickers/SimplePicker';

type Props = {|
  error?: string,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const DESCRIPTION_BY_VALUE = {
  CardOnly:
    'The Brewskey box can be unlocked by tapping a NFC card. Mobile phone NFC will not work.',
  Disabled: 'NFC is turned off on the Brewskey box.',
  PhoneAndCard:
    'THIS CONFIGURATION DOES NOT WORK WELL FOR ANDROID PHONES. The Brewskey box can be unlocked by tapping your phone or card.',
  PhoneOnly:
    'The Brewskey box can be unlocked by tapping your phone. NFC cards will not work.',
};

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

export default DeviceTimeOpenPicker;
