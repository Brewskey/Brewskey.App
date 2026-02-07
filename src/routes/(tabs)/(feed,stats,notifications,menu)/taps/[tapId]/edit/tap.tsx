import * as React from 'react';

import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { ListItem } from 'common/ListItem';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { Section } from 'common/Section';
import { TapForm } from 'components/TapForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import {
  useNotificationsDisabledTaps,
  useToggleNotificationsForTap,
} from 'hooks/queries/NotificationQueries';
import {
  useCreateTap,
  useGetTapById,
  useUpdateTap,
} from 'hooks/queries/TapQueries';
import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, TapMutator } from '@brewskey/js-api';

const EditTapBasicRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const tapIdValue =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  // All hooks must be called unconditionally before any early returns
  const { data: tap, isLoading } = useGetTapById(tapIdValue as EntityID);
  const createTap = useCreateTap();
  const updateTap = useUpdateTap();
  const { data: disabledTaps = [] } = useNotificationsDisabledTaps();
  const toggleNotificationsForTap = useToggleNotificationsForTap();
  const addSnackbarMessage = useAddSnackBarMessage();

  const areNotificationsEnabled =
    tap != null
      ? !disabledTaps.some(
          (id) => getStringFromEntityID(id) === getStringFromEntityID(tap.id),
        )
      : true;

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
              onValueChange: () => {
                if (tap?.id) {
                  toggleNotificationsForTap.mutate(tap.id);
                }
              },
              value: areNotificationsEnabled,
            }}
            testID="switch-notifications-for-tap"
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
};

export default EditTapBasicRoute;
