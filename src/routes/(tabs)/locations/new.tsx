import type { Location, LocationMutator, EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import LocationForm from '../../../components/LocationForm/LocationForm';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateLocation } from '../../../hooks/queries/LocationQueries';

const NewLocationScreen: React.FC = () => {
  const router = useRouter();
  const { onLocationCreated, showBackButton } = useLocalSearchParams<{ 
    onLocationCreated?: string;
    showBackButton?: string;
  }>();

  const mergedProps = {
    onLocationCreated: onLocationCreated ? (() => {
      try {
        return JSON.parse(onLocationCreated);
      } catch (error) {
        console.error('Failed to parse onLocationCreated:', error);
        return undefined;
      }
    })() : undefined,
    showBackButton: showBackButton !== 'false',
  };

  const addSnackBarMessage = useAddSnackBarMessage();
  const createMutation = useCreateLocation();

  const onFormSubmit = async (values: LocationMutator): Promise<void> => {
    const location = await createMutation.mutateAsync(values);
    addSnackBarMessage({ content: 'New location created' });

    if (mergedProps.onLocationCreated) {
      await mergedProps.onLocationCreated(location);
      return;
    }

    // Navigate to location details
    router.navigate(`/(tabs)/locations/${location.id}`);
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

export default withErrorBoundary(NewLocationScreen, <ErrorScreen shouldShowBackButton />);
