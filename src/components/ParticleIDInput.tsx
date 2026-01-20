import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import TextBlock from '../common/TextBlock';
import Button from '../common/buttons/Button';
import { TYPOGRAPHY } from '../theme';
import { FormField } from '../common/form/FormField';
import { TextInput } from '../common/form/TextInput';

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

type Props = {
  onContinuePress: (particleID: string) => void;
};

const ParticleIDInput: React.FC<Props> = ({ onContinuePress }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const formContext = useFormContext();
  const particleID = useWatch({ control: formContext?.control, name: 'particleIDInput' }) || '';

  const handleContinuePress = () => {
    onContinuePress(particleID);
  };

  return (
    <View>
      {!isExpanded ? (
        <TouchableOpacity onPress={() => setIsExpanded(true)}>
          <Text style={styles.expandText}>
            I know my internal Brewskey box ID
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextBlock
            textStyle={styles.descriptionText}
            paddedBottom
          >
            Enter the hardware ID of your Brewskey box. We'll skip the WiFi
            setup for now but you'll still be able to setup your taps.
          </TextBlock>
          <FormField
            component={TextInput}
            name="particleIDInput"
            label="Internal ID"
            defaultValue=""
            testID="input-particleId"
          />
          <Button
            onPress={handleContinuePress}
            title="Continue"
          />
        </>
      )}
    </View>
  );
};

export default ParticleIDInput;
