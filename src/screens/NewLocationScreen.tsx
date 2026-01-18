import type { Location, LocationMutator, EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { useNavigation, StaticScreenProps, NavigationProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import LocationForm from '../components/LocationForm/LocationForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { useCreateLocation } from '../hooks/queries/LocationQueries';

type Props = StaticScreenProps<{
  onLocationCreated?: (location: Location) => undefined | Promise<any>;
  showBackButton?: boolean;
}>;

const NewLocationScreen: React.FC<Props> = ({
  route: {
    params: {
      onLocationCreated,
      showBackButton = true,
    },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const mergedProps = {
    onLocationCreated,
    showBackButton: showBackButton ?? true,
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
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'locations',
        params: {
          screen: 'locationDetails',
          params: {
            id: location.id,
          },
        },
      },
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

export default withErrorBoundary(NewLocationScreen, <ErrorScreen showBackButton />);
