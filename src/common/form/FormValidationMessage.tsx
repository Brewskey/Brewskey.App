import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Text } from '@rneui/themed';
import { COLORS } from '../../theme';
import { ErrorMessage } from '@hookform/error-message';

export const FormValidationText = ({ children }: PropsWithChildren) => (
  <Text
    style={{
      color: COLORS.danger2,
    }}
  >
    {children}
  </Text>
);

export const FormValidationMessage: React.FC<{ fieldName: string }> = ({
  fieldName,
}) => <ErrorMessage name={fieldName} as={FormValidationText} />;
