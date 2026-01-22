import { Button, ButtonProps } from '@rneui/themed';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { handleSubmitWithError } from './handleSubmitWithError';
import nullthrows from 'nullthrows';

export const SubmitButton = <TFieldValues extends FieldValues>({
  onSubmit,
  testID,
  title,
  disabled: externalDisabled,
  ...props
}: Omit<ButtonProps, 'onPress' | 'disabled' | 'loading'> & {
  onSubmit: SubmitHandler<TFieldValues>;
  testID?: string;
  disabled?: boolean;
}) => {
  const form = nullthrows(useFormContext<TFieldValues>(), 'Form context not found. This component must be used within a Form component.');

  
  const {
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  const isDisabled = externalDisabled || isSubmitting || !isValid || !isDirty;

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
