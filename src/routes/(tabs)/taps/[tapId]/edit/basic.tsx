import type { EntityID, TapMutator } from '@brewskey/js-api';

import * as React from 'react';
import { useLocalSearchParams } from 'expo-router';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import Container from '../../../../../common/Container';
import Section from '../../../../../common/Section';
import { TapForm } from '../../../../../components/TapForm';
import {
  useCreateTap,
  useGetTapById,
  useUpdateTap,
} from '../../../../../hooks/queries/TapQueries';
import Header from '../../../../../common/Header';
import LoadingIndicator from '../../../../../common/LoadingIndicator';
import ListItem from '../../../../../common/ListItem';
import ErrorScreen from '../../../../../common/ErrorScreen';
import NotFoundScreen from '../../../../../common/NotFoundScreen';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';

const EditTapBasicRoute: React.FC = withErrorBoundary(() => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const tapIdValue = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
  
  if (!tapIdValue) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  const { data: tap, isLoading } = useGetTapById(tapIdValue as EntityID);
  const createTap = useCreateTap();
  const updateTap = useUpdateTap();

  const [areNotificationEnabled, setAreNotificationsEnabled] =
    React.useState<boolean>(true);
  const addSnackbarMessage = useAddSnackBarMessage();

  const onTapFormSubmit = async (values: TapMutator): Promise<void> => {
    if (tap?.id) {
      await updateTap.mutateAsync(values);
    } else {
      await createTap.mutateAsync(values);
    }
    addSnackbarMessage({
      content: 'Successfully edited tap',
    });
  };

  if (isLoading || !tap || !tap.organization?.id) {
    return (
      <Container>
        <Header shouldShowBackButton title="Edit Tap" />
        <LoadingIndicator />
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Header shouldShowBackButton title="Edit Tap" />
        <Section bottomPadded>
          <ListItem
            chevron={false}
            switch={{
              onValueChange: (value) => {
                console.error('Notifications have not been configured yet');
                setAreNotificationsEnabled(value);
              },
              value: areNotificationEnabled,
            }}
            title="Notifications For Tap"
          />
        </Section>
        <TapForm
          onSubmit={onTapFormSubmit}
          submitButtonLabel="Edit tap"
          tap={tap}
          organizationId={tap.organization.id}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
}, <ErrorScreen shouldShowBackButton />);

export default EditTapBasicRoute;
