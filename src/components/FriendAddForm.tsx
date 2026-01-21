import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';

import { FormValidationMessage } from '../common/form/FormValidationMessage';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { COLORS } from '../theme';
import { TextInput } from '../common/form/TextInput';
import { handleSubmitWithError } from '../common/form/handleSubmitWithError';

const styles = StyleSheet.create({
  input: {
    color: COLORS.textInverse,
  },
  label: {
    color: COLORS.textInverse,
    textAlign: 'center',
  },
  validationText: {
    color: COLORS.danger2,
  },
});

export type FriendAddFormValues = {
  userName: string;
};

type Props = {
  onSubmit: (values: FriendAddFormValues) => Promise<void> | void;
};

const FriendAddForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useForm<FriendAddFormValues>({
    defaultValues: {
      userName: '',
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const validate = (values: FriendAddFormValues): boolean => {
    const errors: Record<string, string> = {};
    if (!values.userName) {
      errors.userName = 'User name or email is required';
    }

    // Set errors in react-hook-form
    Object.keys(errors).forEach((key) => {
      form.setError(key as keyof FriendAddFormValues, {
        type: 'manual',
        message: errors[key],
      });
    });

    return Object.keys(errors).length === 0;
  };

  const onSubmitForm = async (values: FriendAddFormValues) => {
    if (validate(values)) {
      await onSubmit(values);
    }
  };

  return (
    <Form form={form}>
      <View>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          clearButtonMode="always"
          component={TextInput}
          editable={!isSubmitting}
          enablesReturnKeyAutomatically={false}
          inputStyle={styles.input}
          label="Enter user name or email"
          labelStyle={styles.label}
          name="userName"
          onSubmitEditing={handleSubmitWithError(form, onSubmitForm)}
          selectionColor={COLORS.textInverse}
          style={styles.input}
          underlineColorAndroid={COLORS.secondary}
          validationTextStyle={styles.validationText}
        />
        <SectionContent paddedVertical>
          <Button
            disabled={!isDirty || isSubmitting || !isValid}
            loading={isSubmitting}
            onPress={handleSubmitWithError(form, onSubmitForm)}
            secondary
            title="Add Friend"
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export default FriendAddForm;
