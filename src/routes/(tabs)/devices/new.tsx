import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import DeviceForm from '../../../components/DeviceForm';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateDevice } from '../../../hooks/queries/DeviceQueries';

import type { DeviceMutator } from '@brewskey/js-api';

const NewDeviceScreen: React.FC = () => {
  const router = useRouter();
  const { hideLocation, initialValues, onDeviceCreated, showBackButton } =
    useLocalSearchParams<{
      hideLocation?: string;
      initialValues?: string;
      onDeviceCreated?: string;
      showBackButton?: string;
    }>();

  const mergedProps = {
    hideLocation: hideLocation === 'true',
    initialValues: initialValues
      ? (() => {
          try {
            return JSON.parse(initialValues);
          } catch (error) {
            console.error('Failed to parse initialValues:', error);
            return undefined;
          }
        })()
      : undefined,
    onDeviceCreated: onDeviceCreated
      ? (() => {
          try {
            return JSON.parse(onDeviceCreated);
          } catch (error) {
            console.error('Failed to parse onDeviceCreated:', error);
            return undefined;
          }
        })()
      : undefined,
    showBackButton: showBackButton !== 'false',
  };

  const addSnackBarMessage = useAddSnackBarMessage();
  const createMutation = useCreateDevice();

  const onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    const device = await createMutation.mutateAsync(values);
    addSnackBarMessage({ content: 'New Brewskey box created' });

    if (mergedProps.onDeviceCreated) {
      await mergedProps.onDeviceCreated(device);
      return;
    }

    // Navigate to device details
    router.navigate({
      pathname: '/(tabs)/devices/[id]',
      params: { id: device.id.toString() },
    });
  };

  return (
    <Container>
      <Header
        showBackButton={mergedProps.showBackButton}
        title="New Brewskey box"
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <DeviceForm
          device={mergedProps.initialValues ?? {}}
          hideLocation={mergedProps.hideLocation}
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
