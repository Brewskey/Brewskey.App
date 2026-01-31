import { Button } from '@rneui/themed';
import { useFormContext } from 'react-hook-form';

import { handleSubmitWithError } from 'common/form/handleSubmitWithError';

import type { ButtonProps } from '@rneui/themed';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

export const SubmitButton = <TFieldValues extends FieldValues>({
  onSubmit,
  testID,
  title,
  disabled: externalDisabled,
  allowSubmitWhenValid = false,
  ...props
}: Omit<ButtonProps, 'onPress' | 'disabled' | 'loading'> & {
  onSubmit: SubmitHandler<TFieldValues>;
  testID?: string;
  disabled?: boolean;
  allowSubmitWhenValid?: boolean;
}) => {
  const form = useFormContext<TFieldValues>();

  if (!form) {
    console.warn(
      'Form context not found. This component must be used within a Form component.',
    );
    return null;
  }

  const {
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  // For new forms (allowSubmitWhenValid=true), allow submission when valid even if not dirty
  // For edit forms, require both valid and dirty
  const isDisabled =
    externalDisabled ||
    isSubmitting ||
    !isValid ||
    (!allowSubmitWhenValid && !isDirty);

  return (
    <Button
      {...props}
      disabled={isDisabled}
      loading={isSubmitting}
      onPress={handleSubmitWithError(form, onSubmit)}
      testID={testID}
      title={title}
    />
  );
};
