// @flow

import type { Location } from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';
import type { StateConfig } from './stateList';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, FormValidationMessage } from 'react-native-elements';
import STATE_LIST from './stateList';
import { form, FormField } from '../../common/form';
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
  onSubmit: (values: Location) => void | Promise<void>,
  submitButtonLabel: string,
|};

type InjectedProps = {|
  ...FormProps,
|};

@form({ validate })
@observer
class LocationForm extends InjectedComponent<InjectedProps, Props> {
  render() {
    const { location = {}, submitButtonLabel } = this.props;
    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.injectedProps;

    return (
      <KeyboardAwareScrollView style={styles.container}>
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.name}
          label="Name"
          name="name"
          returnKeyType="next"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.summary}
          label="Summary"
          name="summary"
          returnKeyType="next"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.description}
          label="Description"
          name="description"
          returnKeyType="next"
        />
        <FormField
          component={PickerField}
          disabled={submitting}
          initialValue={location.locationType}
          label="Location type"
          name="locationType"
          returnKeyType="next"
        >
          <PickerField.Item label="Kegerator" value="Kegerator" />
          <PickerField.Item label="Bar" value="Bar" />
        </FormField>
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.street}
          label="Street"
          name="street"
          returnKeyType="next"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.suite}
          label="Apt./Suite"
          name="suite"
          returnKeyType="next"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.city}
          label="City"
          name="city"
          returnKeyType="next"
        />
        <FormField
          component={PickerField}
          disabled={submitting}
          initialValue={location.state}
          label="State"
          name="state"
        >
          {STATE_LIST.map((stateConfig: StateConfig): React.Node => (
            <PickerField.Item key={stateConfig.value} {...stateConfig} />
          ))}
        </FormField>
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.zipCode}
          label="Zip"
          name="zipCode"
          keyboardType="numeric"
        />
        <FormField name="id" initialValue={location.id} />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <Button
          disabled={submitting || invalid || pristine}
          onPress={handleSubmit}
          title={submitButtonLabel}
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default LocationForm;
