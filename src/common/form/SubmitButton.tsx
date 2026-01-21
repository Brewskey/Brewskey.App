import { Button, ButtonProps } from '@rneui/themed';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { handleSubmitWithError } from './handleSubmitWithError';

export const SubmitButton = <TFieldValues extends FieldValues>({
  onSubmit,
  testID,
  title,
  ...props
}: Omit<ButtonProps, 'onPress' | 'disabled' | 'loading'> & {
  onSubmit: SubmitHandler<TFieldValues>;
  testID?: string;
}) => {
  const form = useFormContext<TFieldValues>();
  
  const {
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  const isDisabled = isSubmitting || !isValid || !isDirty;

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
