import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { TapForm } from 'components/TapForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useGetDeviceById } from 'hooks/queries/DeviceQueries';
import { useCreateTap } from 'hooks/queries/TapQueries';

import type { TapMutator } from '@brewskey/js-api';

const NewTapScreen: React.FC = () => {
  const router = useRouter();
  const {
    deviceId: deviceIdParam,
    returnTo,
    showBackButton,
  } = useLocalSearchParams<{
    deviceId: string;
    returnTo?: string;
    showBackButton?: string;
  }>();

  const deviceId =
    typeof deviceIdParam === 'string' && !isNaN(Number(deviceIdParam))
      ? Number(deviceIdParam)
      : deviceIdParam;

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
        ...(returnTo ? { returnTo } : {}),
      },
    });
    addSnackBarMessage({ content: 'New tap created' });
  };

  if (!deviceId) {
    return (
      <NotFoundScreen
        message="A device ID is required to create a tap."
        title="Device Required"
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
        message={`The device could not be found. Error: ${error.message}`}
        title="Device Not Found"
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
        message="The device must be associated with an organization."
        title="Organization Required"
      />
    );
  }

  return (
    <Container>
      <Header showBackButton={showBackButton !== 'false'} title="New tap" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <TapForm
          onSubmit={onFormSubmit}
          organizationId={organizationId}
          submitButtonLabel="Create tap"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  NewTapScreen,
  <ErrorScreen shouldShowBackButton />,
);
