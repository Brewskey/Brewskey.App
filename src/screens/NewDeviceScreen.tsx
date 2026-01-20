import type { Device, DeviceMutator, EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { useNavigation, StaticScreenProps, NavigationProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import DeviceForm from '../components/DeviceForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { useCreateDevice } from '../hooks/queries/DeviceQueries';

type Props = StaticScreenProps<{
  hideLocation?: boolean;
  initialValues?: Device;
  onDeviceCreated?: (device: Device) => undefined | Promise<any>;
  showBackButton?: boolean;
}>;

const NewDeviceScreen: React.FC<Props> = ({
  route: {
    params: {
      hideLocation,
      initialValues,
      onDeviceCreated,
      showBackButton = true,
    },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const mergedProps = {
    hideLocation,
    initialValues,
    onDeviceCreated,
    showBackButton: showBackButton ?? true,
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
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'devices',
        params: {
          screen: 'deviceDetails',
          params: {
            id: device.id,
          },
        },
      },
    });
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
