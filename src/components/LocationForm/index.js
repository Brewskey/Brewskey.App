// @flow

import type { Location, LocationMutator } from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { StyleSheet, View } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import STATE_LIST from './stateList';
import { form, FormField } from '../../common/form';
import TextField from '../TextField';
import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import SimplePicker from '../../components/pickers/SimplePicker';

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

const validate = (values: LocationMutator): { [key: string]: string } => {
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
  onSubmit: (values: LocationMutator) => void | Promise<any>,
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
      <View style={styles.container}>
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.name}
          label="Name"
          name="name"
          nextFocusTo="description"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.description}
          label="Description"
          name="description"
        />
        <FormField
          component={SimplePicker}
          disabled={submitting}
          doesRequireConfirmation={false}
          headerTitle="Select Location Type"
          initialValue={location.locationType}
          label="Location type"
          name="locationType"
          pickerValues={[
            { label: 'Kegerator', value: 'Kegerator' },
            { label: 'Bar', value: 'Bar' },
          ]}
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.street}
          label="Street"
          name="street"
          nextFocusTo="suite"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.suite}
          label="Apt./Suite"
          name="suite"
          nextFocusTo="city"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.city}
          label="City"
          name="city"
        />
        <FormField
          component={SimplePicker}
          disabled={submitting}
          doesRequireConfirmation={false}
          headerTitle="Select State"
          initialValue={location.state}
          label="State"
          name="state"
          pickerValues={STATE_LIST}
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={location.zipCode}
          keyboardType="numeric"
          label="Zip"
          name="zipCode"
          onSubmitEditing={handleSubmit}
        />
        <FormField name="id" initialValue={location.id} />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid || pristine}
            loading={submitting}
            onPress={handleSubmit}
            title={submitButtonLabel}
          />
        </SectionContent>
      </View>
    );
  }
}

export default LocationForm;
