import type { EntityID, Tap, TapMutator } from '@brewskey/js-api';

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, StaticScreenProps, NavigationProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import { TapForm } from '../components/TapForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { useCreateTap } from '../hooks/queries/TapQueries';

type Props = StaticScreenProps<{
  initialValues?: Partial<Tap>;
  onTapSetupFinish?: (tapID: EntityID) => undefined | Promise<void>;
  organizationId?: EntityID;
  showBackButton?: boolean;
}>;

const NewTapScreen: React.FC<Props> = ({
  route: {
    params: {
      initialValues,
      onTapSetupFinish,
      organizationId,
      showBackButton = true,
    },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const mergedProps = {
    initialValues,
    onTapSetupFinish,
    organizationId,
    showBackButton: showBackButton ?? true,
  };

  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();
  const createTap = useCreateTap();

  const onFormSubmit = async (values: TapMutator): Promise<void> => {
    const tap = await createTap.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: ['taps'] });
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'newFlowSensor',
        params: {
          onTapSetupFinish: mergedProps.onTapSetupFinish,
          showBackButton: mergedProps.showBackButton,
          tapId: tap.id,
          returnOnFinish: false,
        },
      },
    });
    addSnackBarMessage({ content: 'New tap created' });
  };

  return (
    <Container>
      <Header showBackButton={mergedProps.showBackButton} title="New tap" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        {mergedProps.organizationId && (
          <TapForm
            onSubmit={onFormSubmit}
            submitButtonLabel="Create tap"
            tap={mergedProps.initialValues as Tap | undefined}
            organizationId={mergedProps.organizationId}
          />
        )}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(NewTapScreen, <ErrorScreen showBackButton />);
