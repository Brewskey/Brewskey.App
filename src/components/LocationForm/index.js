// @flow

import type {
  EntityID,
  Location,
  LocationMutator,
  Organization,
} from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import { withNavigationFocus } from 'react-navigation';
import { Fill } from 'react-slot-fill';
import { LoadObject } from 'brewskey.js-api';
import InjectedComponent from '../../common/InjectedComponent';
import { observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import STATE_LIST from './stateList';
import { form, FormField } from '../../common/form';
import TextField from '../TextField';
import Button from '../../common/buttons/Button';
import SimplePicker from '../../components/pickers/SimplePicker';
import { OrganizationStore } from '../../stores/DAOStores';
import OrganizationPicker from '../../components/pickers/OrganizationPicker';

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
  isFocused: Boolean,
  location?: Location,
  onSubmit: (values: LocationMutator) => void | Promise<any>,
  submitButtonLabel: string,
|};

type InjectedProps = {|
  ...FormProps,
|};

@form({ validate })
@withNavigationFocus
@observer
class LocationForm extends InjectedComponent<InjectedProps, Props> {
  @computed
  get _organizationCount(): number {
    return OrganizationStore.count().getValue() || 0;
  }

  @computed
  get _organization(): ?Organization {
    const {
      values: { organizationId },
    } = this.injectedProps;
    if (organizationId) {
      return OrganizationStore.getByID(
        organizationId.id || organizationId,
      ).getValue();
    }

    return OrganizationStore.getMany()
      .map((result) => (result[0] != null ? result[0].getValue() : null))
      .getValue();
  }

  @computed
  get _squareLocationLoader(): LoadObject<
    Array<{|
      locationID: string,
      name: string,
    |}>,
  > {
    if (this._organization == null || !this._organization.canEnablePayments) {
      return LoadObject.empty();
    }

    return OrganizationStore.fetchSquareLocations(this._organization.id);
  }

  render(): React.Node {
    const { isFocused, location = {}, submitButtonLabel } = this.props;
    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.injectedProps;

    let organizationField = null;
    if (this._organizationCount === 1 && this._organization != null) {
      organizationField = (
        <FormField name="organizationId" initialValue={this._organization.id} />
      );
    } else if (this._organizationCount > 1) {
      organizationField = (
        <FormField
          component={OrganizationPicker}
          initialValue={location.organization}
          name="organizationId"
          parseOnSubmit={(value: Organization): EntityID => value.id}
        />
      );
    }

    return (
      <View style={styles.container}>
        <FormField name="id" initialValue={location.id} />
        {organizationField}
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
        />
        {this._organization == null ||
        !this._organization.canEnablePayments ||
        !this._squareLocationLoader.hasValue() ? null : (
          <FormField
            component={SimplePicker}
            disabled={submitting}
            doesRequireConfirmation={false}
            headerTitle="Select Square Location"
            initialValue={location.squareLocationID}
            label="Square Location"
            name="squareLocationID"
            pickerValues={this._squareLocationLoader
              .getValueEnforcing()
              .map((item) => ({
                label: item.name,
                value: item.locationID,
              }))}
          />
        )}
        {!isFocused ? null : (
          <Fill name="MainTabBar">
            <FormValidationMessage>{formError}</FormValidationMessage>
            <Button
              disabled={submitting || invalid || pristine}
              loading={submitting}
              onPress={handleSubmit}
              style={{ marginVertical: 12 }}
              title={submitButtonLabel}
            />
          </Fill>
        )}
      </View>
    );
  }
}

export default LocationForm;
