// @flow

import type {
  FormChildProps,
  FormFieldChildProps,
} from '../../common/form/types';
import type { StateConfig } from './stateList';

import * as React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';
import STATE_LIST from './stateList';
import Form from '../../common/form/Form';
import FormField from '../../common/form/FormField';

import TextField from '../TextField';
import Picker from '../Picker';

const REQUIRED_FIELDS = [
  'city',
  'locationType',
  'name',
  'state',
  'street',
  'zipCode',
];

const isRequiredMessage = (fieldName: string): string =>
  `${fieldName} is required`;

const validate = (values: Location): { [key: string]: string } => {
  const errors = {};

  REQUIRED_FIELDS.forEach((fieldName: string) => {
    if (!values[fieldName]) {
      errors[fieldName] = isRequiredMessage(fieldName);
    }
  });

  return errors;
};

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: 15,
  },
});

type Props = {|
  onSubmit: (values: Location) => Promise<void>,
  submitButtonLabel: string,
|};

// todo figure out and implement good pattern for handling
// fields focus order
const LocationForm = observer(
  ({ onSubmit, submitButtonLabel }: Props): React.Element<*> => (
    <Form validate={validate}>
      {({
        formError,
        handleSubmit,
        invalid,
        submitting,
      }: FormChildProps): React.Element<*> => (
        <View style={styles.formContainer}>
          <FormField name="name">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Name"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="summary">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Summary"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="description">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Description"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="locationType">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <Picker label="Location type" {...formFieldProps}>
                <Picker.Item label="Kegerator" value="Kegerator" />
                <Picker.Item label="Bar" value="Bar" />
              </Picker>
            )}
          </FormField>
          <FormField name="street">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Street address"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="suite">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Apt./Suite"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="city">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="City"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="state">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <Picker label="State" {...formFieldProps}>
                {STATE_LIST.map((stateConfig: StateConfig): React.Element<
                  *,
                > => <Picker.Item key={stateConfig.value} {...stateConfig} />)}
              </Picker>
            )}
          </FormField>
          <FormField name="zipCode">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                keyboardType="numeric"
                label="Zip"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormValidationMessage>{formError}</FormValidationMessage>
          <Button
            disabled={submitting || invalid}
            onPress={(): void => handleSubmit(onSubmit)}
            title={submitButtonLabel}
          />
        </View>
      )}
    </Form>
  ),
);

export default LocationForm;
