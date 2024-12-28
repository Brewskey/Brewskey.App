import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { FormLabel } from './FormLabel';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { TextInput, TextInputProps } from './TextInput';
import { FormValidationMessage } from './FormValidationMessage';

export type Props = TextInputProps & {
  description?: string;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  underlineColorAndroid?: string;
  defaultValue?: string;
  required?: boolean;
  // other react-native textInput props
};

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginHorizontal: 20,
  },
});

export const TextField: React.FC<Props> = ({
  description,
  inputStyle,
  label,
  labelStyle,
  underlineColorAndroid,
  required = false,
  ...props
}) => {
  return (
    <View
      style={{
        marginHorizontal: 16,
      }}
    >
      <FormLabel labelStyle={labelStyle}>{label}</FormLabel>
      <TextInput
        inputStyle={[
          inputStyle,
          {
            borderColor: underlineColorAndroid,
          },
        ]}
        required={required}
        {...props}
      />
      {description == null ? null : (
        <Text style={styles.description}>{description}</Text>
      )}
      <FormValidationMessage fieldName={props.name} />
    </View>
  );
};
