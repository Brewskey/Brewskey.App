import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LocationForm } from 'components/LocationForm/LocationForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useCreateLocation } from 'hooks/queries/LocationQueries';

import type { LocationMutator } from '@brewskey/js-api';

const NewLocationScreen: React.FC = () => {
  const router = useRouter();
  const { returnTo, showBackButton } = useLocalSearchParams<{
    returnTo?: string;
    showBackButton?: string;
  }>();

  const mergedProps = {
    returnTo,
    showBackButton: showBackButton !== 'false',
  };

  const addSnackBarMessage = useAddSnackBarMessage();
  const createMutation = useCreateLocation();

  const onFormSubmit = async (values: LocationMutator): Promise<void> => {
    const location = await createMutation.mutateAsync(values);
    addSnackBarMessage({ content: 'New location created' });

    if (mergedProps.returnTo === 'nux-wifi') {
      router.replace({
        pathname: '/(tabs)/(nux)/wifi',
        params: { locationId: location.id.toString() },
      });
      return;
    }

    // Navigate to location details
    router.navigate({
      pathname: '/(tabs)/locations/[id]',
      params: { id: location.id.toString() },
    });
  };

  return (
    <Container>
      <Header
        showBackButton={mergedProps.showBackButton}
        title="New location"
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <LocationForm
          onSubmit={onFormSubmit}
          submitButtonLabel="Create location"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  NewLocationScreen,
  <ErrorScreen shouldShowBackButton />,
);
