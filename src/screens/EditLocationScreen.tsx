import type {
  EntityID,
  LocationMutator,
} from '@brewskey/js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { useNavigation, StaticScreenProps, NavigationProp } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LocationDAO } from '@brewskey/js-api';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import LoadingIndicator from '../common/LoadingIndicator';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import LocationForm from '../components/LocationForm/LocationForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGetLocationById } from '../hooks/queries/LocationQueries';

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const EditLocationScreen: React.FC<Props> = ({
  route: {
    params: { id },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();

  const { data: location, isLoading } = useGetLocationById(id);

  const updateMutation = useMutation({
    mutationFn: (values: LocationMutator) => {
      const locationId = nullthrows(values.id);
      return LocationDAO.put(locationId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location_by_id', id] });
      navigation.goBack();
      addSnackBarMessage({ content: 'Location edited.' });
    },
  });

  const onFormSubmit = async (values: LocationMutator): Promise<void> => {
    await updateMutation.mutateAsync(values);
  };

  if (isLoading || !location) {
    return (
      <Container>
        <Header showBackButton title="Edit location" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
        </KeyboardAwareScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <Header showBackButton title="Edit location" />
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

export default withErrorBoundary(EditLocationScreen, <ErrorScreen showBackButton />);
