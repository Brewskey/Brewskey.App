import * as React from 'react';

import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { handleSubmitWithError } from 'common/form/handleSubmitWithError';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { SectionContent } from 'common/SectionContent';
import { COLORS } from 'theme';

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

export interface FriendAddFormValues {
  userName: string;
}

interface Props {
  onSubmit: (values: FriendAddFormValues) => Promise<void> | void;
}

const FriendAddForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useForm<FriendAddFormValues>({
    defaultValues: {
      userName: '',
    },
  });

  const {
    formState: { isSubmitting },
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
        <FormField<FriendAddFormValues, typeof TextInput>
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          component={TextInput}
          editable={!isSubmitting}
          enablesReturnKeyAutomatically={false}
          inputStyle={styles.input}
          label="Enter user name or email"
          labelStyle={styles.label}
          name="userName"
          onSubmitEditing={handleSubmitWithError(form, onSubmitForm)}
          required
          selectionColor={COLORS.textInverse}
          style={styles.input}
          testID="input-userName"
          underlineColorAndroid={COLORS.secondary}
          validationTextStyle={styles.validationText}
        />
        <SectionContent paddedVertical>
          <SubmitButton<FriendAddFormValues>
            allowSubmitWhenValid
            buttonStyle={{ backgroundColor: COLORS.secondary }}
            onSubmit={onSubmitForm}
            testID="button-add-friend"
            title="Add Friend"
            titleStyle={{ color: COLORS.text }}
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export { FriendAddForm };
