// @flow

import type {
  FormChildProps,
  FormFieldChildProps,
} from '../../common/form/types';
import type { StateConfig } from './stateList';

import * as React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
  container: {
    paddingBottom: 15,
  },
});

type Props = {|
  location?: Location,
  onSubmit: (values: Location) => Promise<void>,
  submitButtonLabel: string,
|};

// todo figure out and implement good pattern for handling
// fields focus order
const LocationForm = observer(
  ({ location = {}, onSubmit, submitButtonLabel }: Props): React.Element<*> => (
    <Form validate={validate}>
      {({
        formError,
        handleSubmit,
        invalid,
        pristine,
        submitting,
      }: FormChildProps): React.Element<*> => (
        <KeyboardAwareScrollView style={styles.container}>
          <FormField initialValue={location.name} name="name">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                returnKeyType="next"
                disabled={submitting}
                label="Name"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField initialValue={location.summary} name="summary">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                returnKeyType="next"
                disabled={submitting}
                label="Summary"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField initialValue={location.description} name="description">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Description"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField initialValue={location.locationType} name="locationType">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <Picker label="Location type" {...formFieldProps}>
                <Picker.Item label="Kegerator" value="Kegerator" />
                <Picker.Item label="Bar" value="Bar" />
              </Picker>
            )}
          </FormField>
          <FormField initialValue={location.street} name="street">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Street address"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField initialValue={location.suite} name="suite">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="Apt./Suite"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField initialValue={location.city} name="city">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                label="City"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField initialValue={location.state} name="state">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <Picker label="State" {...formFieldProps}>
                {STATE_LIST.map((stateConfig: StateConfig): React.Element<
                  *,
                > => <Picker.Item key={stateConfig.value} {...stateConfig} />)}
              </Picker>
            )}
          </FormField>
          <FormField initialValue={location.zipCode} name="zipCode">
            {(formFieldProps: FormFieldChildProps): React.Element<*> => (
              <TextField
                disabled={submitting}
                keyboardType="numeric"
                label="Zip"
                {...formFieldProps}
              />
            )}
          </FormField>
          <FormField name="id" initialValue={location.id} />
          <FormValidationMessage>{formError}</FormValidationMessage>
          <Button
            disabled={submitting || invalid || pristine}
            onPress={(): void => handleSubmit(onSubmit)}
            title={submitButtonLabel}
          />
        </KeyboardAwareScrollView>
      )}
    </Form>
  ),
);

export default LocationForm;
