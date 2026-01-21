import type { Device, DeviceMutator, EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import DeviceForm from '../../../components/DeviceForm';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateDevice } from '../../../hooks/queries/DeviceQueries';

const NewDeviceScreen: React.FC = () => {
  const router = useRouter();
  const { hideLocation, initialValues, onDeviceCreated, showBackButton } = useLocalSearchParams<{ 
    hideLocation?: string;
    initialValues?: string;
    onDeviceCreated?: string;
    showBackButton?: string;
  }>();

  const mergedProps = {
    hideLocation: hideLocation === 'true',
    initialValues: initialValues ? (() => {
      try {
        return JSON.parse(initialValues);
      } catch (error) {
        console.error('Failed to parse initialValues:', error);
        return undefined;
      }
    })() : undefined,
    onDeviceCreated: onDeviceCreated ? (() => {
      try {
        return JSON.parse(onDeviceCreated);
      } catch (error) {
        console.error('Failed to parse onDeviceCreated:', error);
        return undefined;
      }
    })() : undefined,
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
    router.navigate(`/(tabs)/devices/${device.id}`);
  };

  return (
    <Container>
      <Header showBackButton={mergedProps.showBackButton} title="New Brewskey box" />
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

export default withErrorBoundary(NewDeviceScreen, <ErrorScreen shouldShowBackButton />);
