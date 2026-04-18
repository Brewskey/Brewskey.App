import * as React from 'react';

import { ErrorMessage } from '@hookform/error-message';
import { Text } from '@rneui/themed';
import { useFormContext } from 'react-hook-form';

import { COLORS } from 'theme';

import type { PropsWithChildren } from 'react';

export const FormValidationText = ({
  children,
  testID,
}: PropsWithChildren & { testID?: string }) => (
  <Text
    testID={testID}
    style={{
      color: COLORS.danger2,
      marginHorizontal: 12,
      marginVertical: 8,
      padding: 8,
    }}
  >
    {children}
  </Text>
);

/**
 * FormValidationMessage displays validation errors for forms.
 *
 * Usage patterns:
 *
 * 1. Field-level errors (fieldName provided):
 *    <FormValidationMessage fieldName="email" />
 *
 * 2. Form-level errors via react-hook-form root error:
 *    <FormValidationMessage />
 *    // Set error with: form.setError('root', { message: 'API error message' })
 *
 * 3. Direct error prop (for mutator errors):
 *    <FormValidationMessage error={mutation.error?.message} />
 */
export const FormValidationMessage: React.FC<{
  fieldName?: string;
  testID?: string;
  error?: string | null;
}> = ({ fieldName, testID, error }) => {
  const { formState } = useFormContext();

  // Default testID for form-level validation messages
  const defaultTestID =
    testID ||
    (fieldName
      ? `form-validation-error-${fieldName}`
      : 'form-validation-error');

  // If a direct error prop is provided, use it
  if (error) {
    return (
      <FormValidationText testID={defaultTestID}>{error}</FormValidationText>
    );
  }

  // If fieldName is provided, use field-level error
  if (fieldName) {
    return (
      <ErrorMessage
        errors={formState?.errors}
        name={fieldName}
        render={({ message }) => (
          <FormValidationText testID={defaultTestID}>
            {message}
          </FormValidationText>
        )}
      />
    );
  }

  // For form-level errors, check errors.root
  if (formState?.errors?.root != null) {
    const rootError = formState.errors.root?.message;
    if (rootError) {
      return (
        <FormValidationText testID={defaultTestID}>
          {rootError}
        </FormValidationText>
      );
    }
  }

  return null;
};
