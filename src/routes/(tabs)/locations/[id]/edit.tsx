import type {
  EntityID,
  LocationMutator,
} from '@brewskey/js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LocationDAO } from '@brewskey/js-api';
import ErrorScreen from '../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import Container from '../../../../common/Container';
import Header from '../../../../common/Header';
import LoadingIndicator from '../../../../common/LoadingIndicator';
import NotFoundScreen from '../../../../common/NotFoundScreen';
import { useAddSnackBarMessage } from '../../../../hooks/context/SnackBarContext';
import LocationForm from '../../../../components/LocationForm/LocationForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGetLocationById } from '../../../../hooks/queries/LocationQueries';

const EditLocationScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();

  const { data: location, isLoading } = useGetLocationById(locationId as EntityID);

  if (!locationId) {
    return (
      <NotFoundScreen
        title="Location Not Found"
        message="The location you're looking for could not be found."
      />
    );
  }

  const updateMutation = useMutation({
    mutationFn: (values: LocationMutator) => {
      const locId = nullthrows(values.id);
      return LocationDAO.put(locId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location_by_id', locationId] });
      router.back();
      addSnackBarMessage({ content: 'Location edited.' });
    },
  });

  const onFormSubmit = async (values: LocationMutator): Promise<void> => {
    await updateMutation.mutateAsync(values);
  };

  if (isLoading || !location) {
    return (
      <Container>
        <Header shouldShowBackButton title="Edit location" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
        </KeyboardAwareScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <Header shouldShowBackButton title="Edit location" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <LocationForm
          location={location}
          onSubmit={onFormSubmit}
          submitButtonLabel="Edit location"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(EditLocationScreen, <ErrorScreen shouldShowBackButton />);
