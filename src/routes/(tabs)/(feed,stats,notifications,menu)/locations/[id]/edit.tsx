import * as React from 'react';

import { LocationDAO } from '@brewskey/js-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import nullthrows from 'nullthrows';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { LocationForm } from 'components/LocationForm/LocationForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useGetLocationById } from 'hooks/queries/LocationQueries';
import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, LocationMutator } from '@brewskey/js-api';

const EditLocationScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  // All hooks must be called unconditionally before any early returns
  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();

  const { data: location, isLoading } = useGetLocationById(
    locationId as EntityID,
  );

  const updateMutation = useMutation({
    mutationFn: async (values: LocationMutator) => {
      const locId = nullthrows(values.id);
      return LocationDAO.put(locId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['location_by_id', getStringFromEntityID(locationId)],
      });
      router.dismissTo({
        pathname: '/locations/[id]',
        params: { id: getStringFromEntityID(locationId as EntityID) },
      });
      addSnackBarMessage({ content: 'Location edited.' });
    },
  });

  const onFormSubmit = async (values: LocationMutator): Promise<void> => {
    await updateMutation.mutateAsync(values);
  };

  if (!locationId) {
    return (
      <NotFoundScreen
        message="The location you're looking for could not be found."
        title="Location Not Found"
      />
    );
  }

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

export default EditLocationScreen;
