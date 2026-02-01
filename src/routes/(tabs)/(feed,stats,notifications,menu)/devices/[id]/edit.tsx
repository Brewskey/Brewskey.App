import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { DeviceForm } from 'components/DeviceForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useGetDeviceById, useUpdateDevice } from 'hooks/queries/DeviceQueries';

import type { DeviceMutator, EntityID } from '@brewskey/js-api';

const EditDeviceScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deviceId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  const { data: device, isLoading } = useGetDeviceById(deviceId as EntityID);
  const updateMutation = useUpdateDevice();
  const addSnackBarMessage = useAddSnackBarMessage();

  if (!deviceId) {
    return (
      <NotFoundScreen
        message="The device you're looking for could not be found."
        title="Device Not Found"
      />
    );
  }

  const onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    await updateMutation.mutateAsync(values);
    router.replace({
      pathname: '/devices/[id]',
      params: { id: deviceId.toString() },
    });
    addSnackBarMessage({ content: 'The Brewskey box was edited' });
  };

  if (isLoading || !device) {
    return (
      <Container>
        <Header shouldShowBackButton title="Edit Brewskey box" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
        </KeyboardAwareScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <Header shouldShowBackButton title="Edit Brewskey box" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <DeviceForm
          device={device}
          onSubmit={onFormSubmit}
          submitButtonLabel="Edit Device"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  EditDeviceScreen,
  <ErrorScreen shouldShowBackButton />,
);
