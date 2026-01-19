import type {
  Beverage,
  BeverageMutator,
  EntityID,
  ShortenedEntity,
  Srm,
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
import { extractShortenedEntityId } from '../utils';

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignSelf: 'center',
    marginVertical: 30,
  },
});

const YEARS_RANGE_LENGTH = 10;

type FormProps = Omit<BeverageMutator, 'availableId' | 'glasswareId' | 'srmId' | 'styleId'> & {
  availability: ShortenedEntity | null | undefined;
  glass: ShortenedEntity | null | undefined;
  srm: Srm | null | undefined;
  style: ShortenedEntity | null | undefined;
  beverageImage?: string;
};

const validate = (
  values: FormProps,
): Partial<Record<keyof FormProps, string>> => {
  const errors: Record<string, string> = {};

  if (!values.name) {
    errors.name = 'Name is required!';
  }

  if (!values.beverageType) {
    errors.beverageType = 'Beverage type is required';
  }

  if (!values.srm) {
    errors.srm = 'SRM is required';
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
  const form = useForm<FormProps>({
    defaultValues: {
      id: beverage?.id,
      name: beverage?.name,
      description: beverage?.description,
      beverageType: beverage?.beverageType,
      servingTemperature: beverage?.servingTemperature,
      year: beverage?.year,
      availability: beverage?.availability,
      glass: beverage?.glass,
      isOrganic: beverage?.isOrganic,
      srm: beverage?.srm,
      style: beverage?.style,
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

  const onSubmitForm = async (formValues: FormProps) => {
    const errors = validate(formValues);
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      Object.keys(errors).forEach((key) => {
        const errorKey = key as keyof FormProps;
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

    await onSubmit({
      ...formValues,
      availableId: extractShortenedEntityId(formValues.availability),
      glasswareId: extractShortenedEntityId(formValues.glass),
      srmId: extractShortenedEntityId(formValues.srm),
      styleId: extractShortenedEntityId(formValues.style),
    });
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
          name="availability"
        />
        <FormField
          component={GlassPicker}
          initialValue={beverage?.glass}
          label="Glass"
          name="glass"
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
          name="srm"
          required="SRM is required"
        />
        {beverageType === 'Beer' && [
          <FormField
            component={StylePicker}
            initialValue={beverage?.style}
            key="style"
            label="Style"
            name="style"
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
