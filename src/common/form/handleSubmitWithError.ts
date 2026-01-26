import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

/**
 * Wraps handleSubmit to automatically catch errors and store them in form state.
 *
 * Usage:
 * ```tsx
 * const form = useForm<FormFields>();
 * const onSubmit = async (values: FormFields) => {
 *   await someMutation.mutateAsync(values);
 * };
 *
 * <Button onPress={handleSubmitWithError(form, onSubmit)} />
 * ```
 */
export const handleSubmitWithError = <TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSubmit: SubmitHandler<TFieldValues>,
) => {
  const wrappedOnSubmit: SubmitHandler<TFieldValues> = async (data, event) => {
    try {
      await onSubmit(data, event);
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return form.handleSubmit(wrappedOnSubmit);
};
