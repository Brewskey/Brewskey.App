import type { EntityID, Tap, TapMutator } from '@brewskey/js-api';

import * as React from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Section from '../common/Section';
import { TapForm } from '../components/TapForm';
import {
  useCreateTap,
  useGetTapById,
  useUpdateTap,
} from '../hooks/queries/TapQueries';
import Header from '../common/Header';
import LoadingIndicator from '../common/LoadingIndicator';
import ListItem from '../common/ListItem';
import ErrorScreen from '../common/ErrorScreen';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';

// Type that works with both StaticScreenProps and MaterialTopTabScreenProps
// We only use route.params.tapId, so this minimal type works for both navigation types
// Making route optional to satisfy ScreenComponentType which can accept ComponentType<{}>
type Props = {
  route?: {
    params: { tapId: EntityID };
  }
};

export const EditTapScreen: React.FC<Props> = withErrorBoundary(
  (props: Props) => {
    const tapId = props.route?.params?.tapId;
    if (!tapId) {
      return null;
    }
    const tap = useGetTapById(tapId);
    const createTap = useCreateTap();
    const updateTap = useUpdateTap();

    const [areNotificationEnabled, setAreNotificationsEnabled] =
      React.useState<boolean>(true);
    const addSnackbarMessage = useAddSnackBarMessage();

    const onTapFormSubmit = async (values: TapMutator): Promise<void> => {
      if (tap.data?.id) {
        await updateTap.mutateAsync(values);
      } else {
        await createTap.mutateAsync(values);
      }
      addSnackbarMessage({
        content: 'Successfully edited tap',
      });
    };

    if (tap.isLoading) {
      return (
        <Container>
          <Header shouldShowBackButton title="Edit Tap" />
          <LoadingIndicator />
        </Container>
      );
    }
    if (tap.status !== 'success' || tap.data == null) {
      return null;
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
            tap={tap.data}
            organizationId={tap.data.organization.id}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  },
  <ErrorScreen shouldShowBackButton />,
);
