import type {
  Availability,
  Beverage,
  BeverageMutator,
  EntityID,
  Glass,
  Srm,
  Style,
} from '@brewskey/js-api';
import type { SimplePickerValue } from '../components/pickers/SimplePicker';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';

import { FormValidationMessage } from '../common/form/FormValidationMessage';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { CheckBoxField } from '../common/form/CheckBoxField';
import { TextInput } from '../common/form/TextInput';
import BeverageImagePicker from '../components/BeverageImagePicker';
import AvailabilityPicker from './pickers/AvailabilityPicker';
import GlassPicker from './pickers/GlassPicker';
import StylePicker from './pickers/StylePicker';
import { SimplePicker } from './pickers/SimplePicker';
import SrmPicker from './pickers/SrmPicker';

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignSelf: 'center',
    marginVertical: 30,
  },
});

const YEARS_RANGE_LENGTH = 10;

const validate = (
  values: BeverageMutator & { beverageImage?: string },
): Partial<Record<keyof (BeverageMutator & { beverageImage?: string }), string>> => {
  const errors: Record<string, string> = {};

  if (!values.name) {
    errors.name = 'Name is required!';
  }

  if (!values.beverageType) {
    errors.beverageType = 'Beverage type is required';
  }

  if (!values.srmId) {
    errors.srmId = 'SRM is required';
  }

  return errors;
};

type Props = {
  beverage?: Beverage;
  onSubmit: (
    values: BeverageMutator & {
      beverageImage?: string;
    },
  ) => undefined | Promise<unknown>;
  submitButtonLabel: string;
};

const BeverageForm: React.FC<Props> = ({ beverage, submitButtonLabel, onSubmit }) => {
  const form = useForm<BeverageMutator & { beverageImage?: string }>({
    defaultValues: {
      id: beverage?.id,
      name: beverage?.name,
      description: beverage?.description,
      beverageType: beverage?.beverageType,
      servingTemperature: beverage?.servingTemperature,
      year: beverage?.year,
      availableId: beverage?.availability?.id,
      glasswareId: beverage?.glass?.id,
      isOrganic: beverage?.isOrganic,
      srmId: beverage?.srm?.id,
      styleId: beverage?.style?.id,
      abv: beverage?.abv,
      originalGravity: beverage?.originalGravity,
      ibu: beverage?.ibu,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const values = useWatch({ control: form.control });
  const beverageType = values.beverageType;

  const currentYear = new Date().getFullYear();
  const yearsRange = [...Array(YEARS_RANGE_LENGTH)]
    .map(
      (_value: null, index: number): number =>
        currentYear - YEARS_RANGE_LENGTH + index + 1,
    )
    .reverse();

  const onSubmitForm = async (formValues: BeverageMutator & { beverageImage?: string }) => {
    const errors = validate(formValues);
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      Object.keys(errors).forEach((key) => {
        const errorKey = key as keyof (BeverageMutator & { beverageImage?: string });
        const errorMessage = errors[errorKey];
        if (errorMessage) {
          form.setError(errorKey, {
            type: 'manual',
            message: errorMessage,
          });
        }
      });
      return;
    }

    await onSubmit(formValues);
  };

  return (
    <Form form={form}>
      <View>
        <FormField
          beverageId={beverage?.id}
          containerStyle={styles.imagePickerContainer}
          component={BeverageImagePicker}
          label=""
          name="beverageImage"
        />
        <FormField
          component={TextInput}
          initialValue={beverage?.name}
          label="Name"
          name="name"
          nextFocusTo="description"
          {...({ required: 'Name is required!' } as Record<string, unknown>)}
        />
        <FormField
          component={TextInput}
          initialValue={beverage?.description ?? undefined}
          label="Description"
          name="description"
        />
        <FormField
          component={SimplePicker}
          headerTitle="Select Beverage Type"
          initialValue={beverage?.beverageType}
          label="Beverage Type"
          name="beverageType"
          pickerValues={[
            { label: 'Beer', value: 'Beer' },
            { label: 'Cider', value: 'Cider' },
            { label: 'Coffee', value: 'Coffee' },
            { label: 'Soda', value: 'Soda' },
          ]}
          doesRequireConfirmation={false}
          required="Beverage type is required"
        />
        <FormField
          component={SimplePicker}
          initialValue={beverage?.servingTemperature}
          headerTitle="Select Serving Temperature"
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
          doesRequireConfirmation={false}
        />
        <FormField
          component={SimplePicker}
          initialValue={beverage?.year?.toString()}
          label="Year"
          name="year"
          pickerValues={yearsRange.map(
            (year: number): SimplePickerValue<string> => ({
              label: year.toString(),
              value: year.toString(),
            }),
          )}
          headerTitle="Select Year"
          doesRequireConfirmation={false}
        />
        <FormField
          component={AvailabilityPicker}
          initialValue={beverage?.availability}
          label="Availability"
          name="availableId"
          _parseOnSubmit={(
            value: unknown,
          ): EntityID | null | undefined => {
            const avail = value as Availability | null | undefined;
            return avail && avail.id;
          }}
        />
        <FormField
          component={GlassPicker}
          initialValue={beverage?.glass}
          label="Glass"
          name="glasswareId"
          _parseOnSubmit={(value: unknown): EntityID | null | undefined => {
            const glass = value as Glass | null | undefined;
            return glass && glass.id;
          }}
        />
        <FormField
          component={CheckBoxField}
          initialValue={beverage?.isOrganic}
          label="Is Organic?"
          name="isOrganic"
        />
        <FormField
          component={SrmPicker}
          initialValue={beverage?.srm}
          key="srm"
          label="Color"
          name="srmId"
          required="SRM is required"
          _parseOnSubmit={(value: unknown): EntityID | null | undefined => {
            const srm = value as Srm | null | undefined;
            return srm && srm.id;
          }}
        />
        {beverageType === 'Beer' && [
          <FormField
            component={StylePicker}
            initialValue={beverage?.style}
            key="style"
            label="Style"
            name="styleId"
            _parseOnSubmit={(value: unknown): EntityID | null | undefined => {
              const style = value as Style | null | undefined;
              return style && style.id;
            }}
          />,
          <FormField
            component={TextInput}
            initialValue={beverage?.abv?.toString()}
            key="abv"
            keyboardType="numeric"
            label="ABV"
            name="abv"
            nextFocusTo="originalGravity"
          />,
          <FormField
            component={TextInput}
            initialValue={beverage?.originalGravity?.toString()}
            key="og"
            keyboardType="numeric"
            label="Original Gravity"
            name="originalGravity"
            nextFocusTo="ibu"
          />,
          <FormField
            component={TextInput}
            initialValue={beverage?.ibu?.toString()}
            key="ibu"
            keyboardType="numeric"
            label="IBU"
            name="ibu"
            onSubmitEditing={handleSubmit(onSubmitForm)}
          />,
        ]}
        <FormValidationMessage />
        <SectionContent paddedVertical>
          <Button
            disabled={!isValid || !isDirty || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmitForm)}
            title={submitButtonLabel}
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export default BeverageForm;
