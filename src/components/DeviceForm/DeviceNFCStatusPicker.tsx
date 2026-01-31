import * as React from 'react';

import { useFormContext } from 'react-hook-form';
import { Linking, StyleSheet, Text } from 'react-native';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { FieldValues } from 'react-hook-form';

const styles = StyleSheet.create({
  descriptionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  linkText: { color: '#007bff', textDecorationLine: 'underline' },
});

const LEARN_MORE_LINK = 'https://brewskey.com/faq#supported-nfc-cards';

const CardComponent: React.FC = () => {
  const addSnackBarMessage = useAddSnackBarMessage();

  const callback = () => {
    Linking.canOpenURL(LEARN_MORE_LINK).then((supported) => {
      if (supported) {
        Linking.openURL(LEARN_MORE_LINK);
      } else {
        addSnackBarMessage({
          content: `Could not open link ${LEARN_MORE_LINK}.`,
          style: 'danger',
        });
      }
    });
  };

  return (
    <React.Fragment>
      <Text style={styles.descriptionText}>
        The Brewskey box can be unlocked by tapping a NFC card. Mobile phone NFC
        will not work.
      </Text>
      <Text
        onPress={callback}
        style={[styles.descriptionText, styles.linkText]}
      >
        See compatible cards and learn more here
      </Text>
    </React.Fragment>
  );
};

const PhoneAndCardComponent: React.FC = () => {
  const addSnackBarMessage = useAddSnackBarMessage();

  const callback = () => {
    Linking.canOpenURL(LEARN_MORE_LINK).then((supported) => {
      if (supported) {
        Linking.openURL(LEARN_MORE_LINK);
      } else {
        addSnackBarMessage({
          content: `Could not open link ${LEARN_MORE_LINK}.`,
          style: 'danger',
        });
      }
    });
  };

  return (
    <React.Fragment>
      <Text style={[styles.descriptionText, { fontWeight: 'bold' }]}>
        THIS CONFIGURATION DOES NOT WORK WELL FOR ANDROID PHONES.
      </Text>
      <Text style={styles.descriptionText}>
        The Brewskey box can be unlocked by tapping your phone or card.
      </Text>
      <Text
        onPress={callback}
        style={[styles.descriptionText, styles.linkText]}
      >
        See compatible cards and learn more here
      </Text>
    </React.Fragment>
  );
};

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
} as const;

interface Props {
  name: string;
  testID?: string;
}

const DeviceNFCStatusPicker = (props: Props): React.ReactElement => {
  const { getValues } = useFormContext();
  const value = getValues(props.name);
  return (
    <FormField<FieldValues, typeof DropdownInput>
      required
      component={DropdownInput}
      label="NFC Status"
      labelField="label"
      name={props.name}
      testID={props.testID}
      valueField="value"
      data={[
        { label: 'Phone Only', value: 'PhoneOnly' },
        { label: 'Card Only', value: 'CardOnly' },
        { label: 'Phone And Card', value: 'PhoneAndCard' },
        { label: 'Disabled', value: 'Disabled' },
      ]}
      description={
        value
          ? DESCRIPTION_BY_VALUE[value as keyof typeof DESCRIPTION_BY_VALUE]
          : undefined
      }
    />
  );
};

export { DeviceNFCStatusPicker };
