import * as React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { BeverageImagePicker } from './BeverageImagePicker';
import { TextInput } from '../common/form/TextInput';
import { extractShortenedEntityId } from '../utils';
import { AvailabilityPicker } from './pickers/AvailabilityPicker';
import { BeverageTypePicker } from './pickers/BeverageTypePicker';
import { GlassPicker } from './pickers/GlassPicker';
import { ServingTemperaturePicker } from './pickers/ServingTemperaturePicker';
import { SrmPicker } from './pickers/SrmPicker';
import { StylePicker } from './pickers/StylePicker';
import { YearPicker } from './pickers/YearPicker';
import { Button } from '../common/buttons/Button';
import { CheckBoxField } from '../common/form/CheckBoxField';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../common/form/handleSubmitWithError';
import { SectionContent } from '../common/SectionContent';

import type {
  Beverage,
  BeverageMutator,
  ShortenedEntity,
  Srm,
} from '@brewskey/js-api';

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignSelf: 'center',
    marginVertical: 30,
  },
});

type FormProps = Omit<
  BeverageMutator,
  'availableId' | 'glasswareId' | 'srmId' | 'styleId'
> & {
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

interface Props {
  beverage?: Beverage;
  onSubmit: (
    values: BeverageMutator & {
      beverageImage?: string;
    },
  ) => undefined | Promise<unknown>;
  submitButtonLabel: string;
}

const BeverageForm: React.FC<Props> = ({
  beverage,
  submitButtonLabel,
  onSubmit,
}) => {
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
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const values = useWatch({ control: form.control });
  const { beverageType } = values;

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
        <FormValidationMessage />
        <FormField
          beverageId={beverage?.id}
          component={BeverageImagePicker}
          containerStyle={styles.imagePickerContainer}
          label=""
          name="beverageImage"
        />
        <FormField
          component={TextInput}
          defaultValue={beverage?.name}
          label="Name"
          name="name"
          nextFocusTo="description"
          testID="input-name"
          {...({ required: 'Name is required!' } as Record<string, unknown>)}
        />
        <FormField
          component={TextInput}
          defaultValue={beverage?.description ?? undefined}
          label="Description"
          name="description"
          testID="input-description"
        />
        <BeverageTypePicker
          defaultValue={beverage?.beverageType}
          name="beverageType"
          required="Beverage type is required"
        />
        <ServingTemperaturePicker
          defaultValue={beverage?.servingTemperature ?? undefined}
          name="servingTemperature"
        />
        <YearPicker defaultValue={beverage?.year?.toString()} name="year" />
        <FormField
          component={AvailabilityPicker}
          defaultValue={beverage?.availability}
          label="Availability"
          name="availability"
        />
        <FormField
          component={GlassPicker}
          defaultValue={beverage?.glass}
          label="Glass"
          name="glass"
        />
        <FormField
          component={CheckBoxField}
          defaultValue={beverage?.isOrganic}
          label="Is Organic?"
          name="isOrganic"
          testID="input-isOrganic"
        />
        <FormField
          key="srm"
          component={SrmPicker}
          defaultValue={beverage?.srm}
          label="Color"
          name="srm"
          required="SRM is required"
        />
        {beverageType === 'Beer' && [
          <FormField
            key="style"
            component={StylePicker}
            defaultValue={beverage?.style}
            label="Style"
            name="style"
          />,
          <FormField
            key="abv"
            component={TextInput}
            defaultValue={beverage?.abv?.toString() ?? ''}
            keyboardType="numeric"
            label="ABV"
            name="abv"
            nextFocusTo="originalGravity"
            testID="input-abv"
          />,
          <FormField
            key="og"
            component={TextInput}
            defaultValue={beverage?.originalGravity?.toString()}
            keyboardType="numeric"
            label="Original Gravity"
            name="originalGravity"
            nextFocusTo="ibu"
            testID="input-originalGravity"
          />,
          <FormField
            key="ibu"
            component={TextInput}
            defaultValue={beverage?.ibu?.toString()}
            keyboardType="numeric"
            label="IBU"
            name="ibu"
            onSubmitEditing={handleSubmitWithError(form, onSubmitForm)}
            testID="input-ibu"
          />,
        ]}
        <SectionContent paddedVertical>
          <Button
            disabled={!isValid || !isDirty || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmitWithError(form, onSubmitForm)}
            title={submitButtonLabel}
            testID={
              beverage?.id
                ? 'submit-button-edit-beverage'
                : 'submit-button-create-beverage'
            }
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export { BeverageForm };
