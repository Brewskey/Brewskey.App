import * as React from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { FormField } from 'common/form/FormField';
import { TextInput } from 'common/form/TextInput';
import { OrderedText } from 'common/OrderedText';
import { TYPOGRAPHY } from 'theme';

import type { FieldValues } from 'react-hook-form';

const styles = StyleSheet.create({
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    textAlign: 'center',
  },
  expandText: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

interface Props {
  onContinuePress: (particleID: string) => void;
}

const ParticleIDInput: React.FC<Props> = ({ onContinuePress }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const formContext = useFormContext();
  const particleID =
    useWatch({ control: formContext?.control, name: 'particleIDInput' }) || '';

  const handleContinuePress = () => {
    onContinuePress(particleID);
  };

  return (
    <View>
      {!isExpanded ? (
        <TouchableOpacity
          onPress={() => setIsExpanded(true)}
          testID="button-expand-particle-id"
        >
          <Text style={styles.expandText}>
            I know my internal Brewskey box ID
          </Text>
        </TouchableOpacity>
      ) : (
        <React.Fragment>
          <OrderedText paddedBottom textStyle={styles.descriptionText}>
            Enter the hardware ID of your Brewskey box. We'll skip the WiFi
            setup for now but you'll still be able to setup your taps.
          </OrderedText>
          <FormField<FieldValues, typeof TextInput>
            component={TextInput}
            defaultValue=""
            label="Internal ID"
            name="particleIDInput"
            testID="input-particleId"
          />
          <Button onPress={handleContinuePress} title="Continue" />
        </React.Fragment>
      )}
    </View>
  );
};

export { ParticleIDInput };
