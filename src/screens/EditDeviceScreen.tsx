import type {
  DeviceMutator,
  EntityID,
} from '@brewskey/js-api';

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, StaticScreenProps, NavigationProp } from '@react-navigation/native';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import DeviceForm from '../components/DeviceForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { useGetDeviceById, useUpdateDevice } from '../hooks/queries/DeviceQueries';

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const EditDeviceScreen: React.FC<Props> = ({
  route: {
    params: { id },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const { data: device, isLoading } = useGetDeviceById(id);
  const updateMutation = useUpdateDevice();
  const addSnackBarMessage = useAddSnackBarMessage();

  const onFormSubmit = async (values: DeviceMutator): Promise<void> => {
    try {
      await updateMutation.mutateAsync(values);
      navigation.goBack();
      addSnackBarMessage({ content: 'The Brewskey box was edited' });
    } catch (error: unknown) {
      throw new Error(
        "There was an issue saving your device. We'll look into it!",
      );
    }
  };

  if (isLoading || !device) {
    return (
      <Container>
        <Header showBackButton title="Edit Brewskey box" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
        </KeyboardAwareScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <Header showBackButton title="Edit Brewskey box" />
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

export default withErrorBoundary(EditDeviceScreen, <ErrorScreen showBackButton />);
