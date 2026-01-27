import * as React from 'react';

import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from '../../../../../common/Container';
import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../../../common/ErrorScreen';
import { Header } from '../../../../../common/Header';
import { ListItem } from '../../../../../common/ListItem';
import { LoadingIndicator } from '../../../../../common/LoadingIndicator';
import { NotFoundScreen } from '../../../../../common/NotFoundScreen';
import { Section } from '../../../../../common/Section';
import { TapForm } from '../../../../../components/TapForm';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';
import {
  useCreateTap,
  useGetTapById,
  useUpdateTap,
} from '../../../../../hooks/queries/TapQueries';

import type { EntityID, TapMutator } from '@brewskey/js-api';

const EditTapBasicRoute: React.FC = withErrorBoundary(
  () => {
    const { tapId } = useLocalSearchParams<{ tapId: string }>();
    const tapIdValue =
      typeof tapId === 'string' && !isNaN(Number(tapId))
        ? Number(tapId)
        : tapId;

    // All hooks must be called unconditionally before any early returns
    const { data: tap, isLoading } = useGetTapById(tapIdValue as EntityID);
    const createTap = useCreateTap();
    const updateTap = useUpdateTap();

    const [areNotificationEnabled, setAreNotificationsEnabled] =
      React.useState<boolean>(true);
    const addSnackbarMessage = useAddSnackBarMessage();

    if (!tapIdValue) {
      return (
        <NotFoundScreen
          message="The tap you're looking for could not be found."
          title="Tap Not Found"
        />
      );
    }

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

    if (isLoading || !tap?.organization?.id) {
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
          <Section bottomPadded>
            <ListItem
              chevron={false}
              title="Notifications For Tap"
              switch={{
                onValueChange: (value) => {
                  console.error('Notifications have not been configured yet');
                  setAreNotificationsEnabled(value);
                },
                value: areNotificationEnabled,
              }}
            />
          </Section>
          <TapForm
            onSubmit={onTapFormSubmit}
            organizationId={tap.organization.id}
            submitButtonLabel="Edit tap"
            tap={tap}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  },
  <ErrorScreen shouldShowBackButton />,
);

export default EditTapBasicRoute;
