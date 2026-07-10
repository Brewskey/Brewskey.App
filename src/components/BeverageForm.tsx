import * as React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { CheckBoxInput } from 'common/form/CheckBoxInput';
import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { handleSubmitWithError } from 'common/form/handleSubmitWithError';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { SectionContent } from 'common/SectionContent';
import { BeverageImagePicker } from 'components/BeverageImagePicker';
import { AvailabilityPicker } from 'components/pickers/AvailabilityPicker';
import { BeverageTypePicker } from 'components/pickers/BeverageTypePicker';
import { GlassPicker } from 'components/pickers/GlassPicker';
import { ServingTemperaturePicker } from 'components/pickers/ServingTemperaturePicker';
import { SrmPicker } from 'components/pickers/SrmPicker';
import { StylePicker } from 'components/pickers/StylePicker';
import { YearPicker } from 'components/pickers/YearPicker';

import { useHideMainTabBar } from './MainTabBar/MainTabBarSlot';

import type { Beverage, BeverageMutator } from '@brewskey/js-api';

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignSelf: 'center',
    marginVertical: 30,
  },
});

type FormProps = BeverageMutator & {
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

  if (!values.srmId) {
    errors.srmId = 'SRM is required';
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
  useHideMainTabBar();
  const form = useForm<FormProps>({
    mode: 'all',
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

    // TextInputs yield strings; the API's numeric fields reject empty
    // strings (400) and need real numbers. Blank optional fields are omitted.
    const toOptionalNumber = (value: unknown): number | undefined => {
      if (value === '' || value == null) {
        return undefined;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    };

    await onSubmit({
      ...formValues,
      abv: toOptionalNumber(formValues.abv) as FormProps['abv'],
      ibu: toOptionalNumber(formValues.ibu) as FormProps['ibu'],
      originalGravity: toOptionalNumber(
        formValues.originalGravity,
      ) as FormProps['originalGravity'],
      year: toOptionalNumber(formValues.year) as FormProps['year'],
    });
  };

  return (
    <Form form={form}>
      <View>
        <FormValidationMessage />
        <FormField<FormProps, typeof BeverageImagePicker>
          beverageId={beverage?.id}
          component={BeverageImagePicker}
          containerStyle={styles.imagePickerContainer}
          label=""
          name="beverageImage"
        />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={beverage?.name}
          label="Name"
          name="name"
          nextFocusTo="description"
          testID="input-name"
          {...({ required: 'Name is required!' } as Record<string, unknown>)}
        />
        <FormField<FormProps, typeof TextInput>
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
          testID="beverage-type-dropdown"
        />
        <ServingTemperaturePicker
          defaultValue={beverage?.servingTemperature ?? undefined}
          name="servingTemperature"
        />
        <YearPicker defaultValue={beverage?.year?.toString()} name="year" />
        <FormField<FormProps, typeof AvailabilityPicker>
          component={AvailabilityPicker}
          defaultValue={beverage?.availability}
          label="Availability"
          name="availableId"
        />
        <FormField<FormProps, typeof GlassPicker>
          component={GlassPicker}
          defaultValue={beverage?.glass}
          label="Glass"
          name="glasswareId"
        />
        <FormField<FormProps, typeof CheckBoxInput>
          component={CheckBoxInput}
          defaultValue={beverage?.isOrganic}
          label="Is Organic?"
          name="isOrganic"
          testID="input-isOrganic"
        />
        <FormField<FormProps, typeof SrmPicker>
          key="srm"
          component={SrmPicker}
          defaultValue={beverage?.srm}
          label="Color"
          name="srmId"
          required="SRM is required"
          testID="color-dropdown"
        />
        {beverageType === 'Beer' && [
          <FormField<FormProps, typeof StylePicker>
            key="style"
            component={StylePicker}
            defaultValue={beverage?.style}
            label="Style"
            name="styleId"
          />,
          <FormField<FormProps, typeof TextInput>
            key="abv"
            component={TextInput}
            defaultValue={beverage?.abv?.toString() ?? ''}
            keyboardType="numeric"
            label="ABV"
            name="abv"
            nextFocusTo="originalGravity"
            testID="input-abv"
          />,
          <FormField<FormProps, typeof TextInput>
            key="og"
            component={TextInput}
            defaultValue={beverage?.originalGravity?.toString()}
            keyboardType="numeric"
            label="Original Gravity"
            name="originalGravity"
            nextFocusTo="ibu"
            testID="input-originalGravity"
          />,
          <FormField<FormProps, typeof TextInput>
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
          <SubmitButton<FormProps>
            allowSubmitWhenValid={!beverage}
            onSubmit={onSubmitForm}
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
