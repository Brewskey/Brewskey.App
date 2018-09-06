// @flow

import type {
  Availability,
  Beverage,
  BeverageMutator,
  EntityID,
  Glass,
  Srm,
  Style,
} from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';
import type { SimplePickerValue } from '../components/pickers/SimplePicker';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import { form, FormField } from '../common/form';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import BeverageImagePicker from '../components/BeverageImagePicker';
import AvailabilityPicker from './pickers/AvailabilityPicker';
import GlassPicker from './pickers/GlassPicker';
import StylePicker from './pickers/StylePicker';
import SimplePicker from './pickers/SimplePicker';
import SrmPicker from './pickers/SrmPicker';

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignSelf: 'center',
    marginVertical: 30,
  },
});

const YEARS_RANGE_LENGTH = 10;

const validate = (values: BeverageMutator): { [key: string]: string } => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is required!';
  }

  if (!values.beverageType) {
    errors.beverageType = 'Beverage type is required';
  }

  return errors;
};

type Props = {|
  beverage?: Beverage,
  onSubmit: (
    values: BeverageMutator & { beverageImage?: string },
  ) => void | Promise<any>,
  submitButtonLabel: string,
|};

type InjectedProps = FormProps;

@form({ validate })
@observer
class BeverageForm extends InjectedComponent<InjectedProps, Props> {
  render() {
    const { beverage = {}, submitButtonLabel } = this.props;

    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
      values,
    } = this.injectedProps;

    const currentYear = new Date().getFullYear();
    const yearsRange = [...Array(YEARS_RANGE_LENGTH)]
      .map(
        (value: null, index: number): number =>
          currentYear - YEARS_RANGE_LENGTH + index + 1,
      )
      .reverse();

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <FormField
          beverageId={beverage.id}
          containerStyle={styles.imagePickerContainer}
          component={BeverageImagePicker}
          name="beverageImage"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={beverage.name}
          label="Name"
          name="name"
          nextFocusTo="description"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={beverage.description}
          label="Description"
          name="description"
          placeholder="Please select..."
        />
        <FormField
          component={SimplePicker}
          disabled={submitting}
          headerTitle="Select Beverage Type"
          initialValue={beverage.beverageType}
          label="Beverage Type"
          name="beverageType"
          pickerValues={[
            { label: 'Beer', value: 'Beer' },
            { label: 'Cider', value: 'Cider' },
            { label: 'Coffee', value: 'Coffee' },
            { label: 'Soda', value: 'Soda' },
          ]}
        />
        <FormField
          component={SimplePicker}
          disabled={submitting}
          initialValue={beverage.servingTemperature}
          label="Serving temperature"
          name="servingTemperature"
          pickerValues={[
            { label: 'Cellar', value: 'cellar' },
            { label: 'Very Cold', value: 'very_cold' },
            { label: 'Cold', value: 'cold' },
            { label: 'Cool', value: 'cool' },
            { label: 'Warm', value: 'warm' },
            { label: 'Hot', value: 'hot' },
          ]}
        />
        <FormField
          component={SimplePicker}
          disabled={submitting}
          initialValue={beverage.year}
          label="Year"
          name="year"
          pickerValues={yearsRange.map((year: number): SimplePickerValue<
            string,
          > => ({
            label: year.toString(),
            value: year.toString(),
          }))}
        />
        <FormField
          component={AvailabilityPicker}
          disabled={submitting}
          initialValue={beverage.availability}
          name="availableId"
          parseOnSubmit={(value: ?Availability): ?EntityID => value && value.id}
        />
        <FormField
          component={GlassPicker}
          disabled={submitting}
          initialValue={beverage.glass}
          name="glasswareId"
          parseOnSubmit={(value: ?Glass): ?EntityID => value && value.id}
        />
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={beverage.isOrganic}
          label="Is Organic?"
          name="isOrganic"
        />
        {values.beverageType === 'Beer' && [
          <FormField
            component={SrmPicker}
            disabled={submitting}
            initialValue={beverage.srm}
            key="srm"
            label="Srm"
            name="srmId"
            parseOnSubmit={(value: ?Srm): ?EntityID => value && value.id}
          />,
          <FormField
            component={StylePicker}
            disabled={submitting}
            initialValue={beverage.style}
            key="style"
            label="Style"
            name="styleId"
            parseOnSubmit={(value: ?Style): ?EntityID => value && value.id}
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.abv}
            key="abv"
            keyboardType="numeric"
            label="ABV"
            name="abv"
            nextFocusTo="originalGravity"
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.originalGravity}
            key="og"
            keyboardType="numeric"
            label="Original Gravity"
            name="originalGravity"
            nextFocusTo="ibu"
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.ibu}
            key="ibu"
            keyboardType="numeric"
            label="IBU"
            name="ibu"
            onSubmitEditing={handleSubmit}
          />,
        ]}
        <FormField initialValue={beverage.id} name="id" />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid || pristine}
            loading={submitting}
            onPress={handleSubmit}
            title={submitButtonLabel}
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default BeverageForm;
