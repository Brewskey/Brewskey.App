import type { EntityID, TapMutator } from '@brewskey/js-api';

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import LoadingIndicator from '../../../common/LoadingIndicator';
import NotFoundScreen from '../../../common/NotFoundScreen';
import { TapForm } from '../../../components/TapForm';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateTap } from '../../../hooks/queries/TapQueries';
import { useGetDeviceById } from '../../../hooks/queries/DeviceQueries';

const NewTapScreen: React.FC = () => {
  const router = useRouter();
  const { deviceId: deviceIdParam, showBackButton, onTapSetupFinish } = useLocalSearchParams<{ 
    deviceId: string;
    showBackButton?: string;
    onTapSetupFinish?: string;
  }>();

  const deviceId = typeof deviceIdParam === 'string' && !isNaN(Number(deviceIdParam)) 
    ? Number(deviceIdParam) 
    : deviceIdParam as EntityID | undefined;

  const { data: device, isLoading, error } = useGetDeviceById(deviceId);
  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();
  const createTap = useCreateTap();

  const onFormSubmit = async (values: TapMutator): Promise<void> => {
    const tap = await createTap.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: ['taps'] });
    
    router.navigate({
      pathname: '/(tabs)/flow-sensor/new',
      params: {
        tapId: tap.id.toString(),
        shouldReturnOnFinish: 'false',
        showBackButton: (showBackButton !== 'false').toString(),
        ...(onTapSetupFinish ? { onTapSetupFinish } : {}),
      },
    });
    addSnackBarMessage({ content: 'New tap created' });
  };

  if (!deviceId) {
    return (
      <NotFoundScreen
        title="Device Required"
        message="A device ID is required to create a tap."
      />
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Header showBackButton={showBackButton !== 'false'} title="New tap" />
        <LoadingIndicator testID="device-loading" />
      </Container>
    );
  }

  if (error) {
    return (
      <NotFoundScreen
        title="Device Not Found"
        message={`The device could not be found. Error: ${error.message}`}
      />
    );
  }

  if (!device) {
    return (
      <Container>
        <Header showBackButton={showBackButton !== 'false'} title="New tap" />
        <LoadingIndicator testID="device-loading" />
      </Container>
    );
  }

  const organizationId = device.organization?.id;
  if (!organizationId) {
    return (
      <NotFoundScreen
        title="Organization Required"
        message="The device must be associated with an organization."
      />
    );
  }

  return (
    <Container>
      <Header showBackButton={showBackButton !== 'false'} title="New tap" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <TapForm
          onSubmit={onFormSubmit}
          submitButtonLabel="Create tap"
          organizationId={organizationId}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(NewTapScreen, <ErrorScreen shouldShowBackButton />);
