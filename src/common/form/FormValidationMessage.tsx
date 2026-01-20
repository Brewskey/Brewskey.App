import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Text } from '@rneui/themed';
import { COLORS } from '../../theme';
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';

export const FormValidationText = ({ children, testID }: PropsWithChildren & { testID?: string }) => (
  <Text
    style={{
      color: COLORS.danger2,
    }}
    testID={testID}
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
}> = ({
  fieldName,
  testID,
  error,
}) => {
  const formContext = useFormContext();
  
  // If a direct error prop is provided, use it
  if (error) {
    return <FormValidationText testID={testID}>{error}</FormValidationText>;
  }
  
  // If fieldName is provided, use field-level error
  if (fieldName) {
    return <ErrorMessage name={fieldName} as={(props: any) => <FormValidationText {...props} testID={testID} />} />;
  }
  
  // For form-level errors, check errors.root
  if (formContext) {
    const rootError = formContext.formState.errors.root?.message;
    if (rootError) {
      return <FormValidationText testID={testID}>{rootError}</FormValidationText>;
    }
  }
  
  return null;
};
