// @flow

import type {
  FormChildProps,
  FormFieldChildProps,
  FieldFocusManagerChildProps,
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
import FieldFocusManager from '../../common/form/FieldFocusManager';
import TextField from '../TextField';
import PickerField from '../PickerField';

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
  ({ location = {}, onSubmit, submitButtonLabel }: Props): React.Node => (
    <Form validate={validate}>
      {({
        formError,
        handleSubmit,
        invalid,
        pristine,
        submitting,
      }: FormChildProps): React.Node => (
        <FieldFocusManager>
          {({
            addFieldRef,
            focusField,
          }: FieldFocusManagerChildProps): React.Node => (
            <KeyboardAwareScrollView style={styles.container}>
              <FormField initialValue={location.name} name="name">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(0)}
                    label="Name"
                    onSubmitEditing={focusField(1)}
                    returnKeyType="next"
                    {...formFieldProps}
                  />
                )}
              </FormField>
              <FormField initialValue={location.summary} name="summary">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(1)}
                    label="Summary"
                    onSubmitEditing={focusField(2)}
                    returnKeyType="next"
                    {...formFieldProps}
                  />
                )}
              </FormField>
              <FormField initialValue={location.description} name="description">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(2)}
                    label="Description"
                    returnKeyType="next"
                    {...formFieldProps}
                  />
                )}
              </FormField>
              <FormField
                initialValue={location.locationType}
                name="locationType"
              >
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <PickerField label="Location type" {...formFieldProps}>
                    <PickerField.Item label="Kegerator" value="Kegerator" />
                    <PickerField.Item label="Bar" value="Bar" />
                  </PickerField>
                )}
              </FormField>
              <FormField initialValue={location.street} name="street">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(3)}
                    label="Street address"
                    onSubmitEditing={focusField(4)}
                    returnKeyType="next"
                    {...formFieldProps}
                  />
                )}
              </FormField>
              <FormField initialValue={location.suite} name="suite">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(4)}
                    label="Apt./Suite"
                    onSubmitEditing={focusField(5)}
                    returnKeyType="next"
                    {...formFieldProps}
                  />
                )}
              </FormField>
              <FormField initialValue={location.city} name="city">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(5)}
                    label="City"
                    returnKeyType="next"
                    {...formFieldProps}
                  />
                )}
              </FormField>
              <FormField initialValue={location.state} name="state">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <PickerField label="State" {...formFieldProps}>
                    {STATE_LIST.map((stateConfig: StateConfig): React.Node => (
                      <PickerField.Item
                        key={stateConfig.value}
                        {...stateConfig}
                      />
                    ))}
                  </PickerField>
                )}
              </FormField>
              <FormField initialValue={location.zipCode} name="zipCode">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    inputRef={addFieldRef(6)}
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
        </FieldFocusManager>
      )}
    </Form>
  ),
);

export default LocationForm;
