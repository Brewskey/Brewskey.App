import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { DeviceForm } from 'components/DeviceForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useCreateDevice } from 'hooks/queries/DeviceQueries';
import { useGetLocationById } from 'hooks/queries/LocationQueries';

import type { DeviceMutator } from '@brewskey/js-api';

const NewDeviceScreen: React.FC = () => {
  const router = useRouter();
  const { particleId, locationId, returnTo, showBackButton } =
    useLocalSearchParams<{
      particleId?: string;
      locationId?: string;
      returnTo?: string;
      showBackButton?: string;
    }>();

  const { data: location, isPending: isLoadingLocation } = useGetLocationById(
    locationId ? Number(locationId) : undefined,
  );

  const addSnackBarMessage = useAddSnackBarMessage();
  const createMutation = useCreateDevice();

  const onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const device = await createMutation.mutateAsync(values);
    addSnackBarMessage({ content: 'New Brewskey box created' });

    if (returnTo === 'nux-tap') {
      router.replace({
        pathname: '/(tabs)/(nux)/tap',
        params: { deviceId: device.id.toString() },
      });
      return;
    }

    // Navigate to device details
    router.navigate({
      pathname: '/(tabs)/devices/[id]',
      params: { id: device.id.toString() },
    });
  };

  if (isLoadingLocation) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <Header
        showBackButton={showBackButton !== 'false'}
        title="New Brewskey box"
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <DeviceForm
          device={{
            particleId,
            location,
          }}
          hideLocation={location != null}
          onSubmit={onFormSubmit}
          submitButtonLabel="Create Device"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  NewDeviceScreen,
  <ErrorScreen shouldShowBackButton />,
);
