import { Button, ButtonProps } from '@rneui/themed';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';

export const SubmitButton = <TFieldValues extends FieldValues>({
  onSubmit,
  ...props
}: Omit<ButtonProps, 'onPress' | 'disabled' | 'loading'> & {
  onSubmit: SubmitHandler<TFieldValues>;
}) => {
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useFormContext<TFieldValues>();

  return (
    <Button
      {...props}
      disabled={isSubmitting || !isValid}
      loading={isSubmitting}
      onPress={handleSubmit(onSubmit)}
    />
  );
};
