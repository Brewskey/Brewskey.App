import { Button, ButtonProps } from '@rneui/themed';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';

export const SubmitButton = ({
  onSubmit,
  ...props
}: Omit<ButtonProps, 'onPress'> & {
  onSubmit: SubmitHandler<FieldValues>;
}) => {
  const { handleSubmit } = useFormContext();

  return <Button {...props} onPress={handleSubmit(onSubmit)} />;
};
