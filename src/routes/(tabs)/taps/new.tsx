import type { EntityID, Tap, TapMutator } from '@brewskey/js-api';

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import { TapForm } from '../../../components/TapForm';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateTap } from '../../../hooks/queries/TapQueries';

const NewTapScreen: React.FC = () => {
  const router = useRouter();
  const { initialValues, onTapSetupFinish, organizationId, showBackButton, deviceId } = useLocalSearchParams<{ 
    initialValues?: string;
    onTapSetupFinish?: string;
    organizationId?: string;
    showBackButton?: string;
    deviceId?: string;
  }>();

  const mergedProps = {
    initialValues: initialValues ? (() => {
      try {
        return JSON.parse(initialValues);
      } catch (error) {
        console.error('Failed to parse initialValues:', error);
        return undefined;
      }
    })() : undefined,
    onTapSetupFinish: onTapSetupFinish ? (() => {
      try {
        return JSON.parse(onTapSetupFinish);
      } catch (error) {
        console.error('Failed to parse onTapSetupFinish:', error);
        return undefined;
      }
    })() : undefined,
    organizationId: organizationId ? (typeof organizationId === 'string' && !isNaN(Number(organizationId)) ? Number(organizationId) : organizationId) : undefined,
    showBackButton: showBackButton !== 'false',
    deviceId: deviceId ? (typeof deviceId === 'string' && !isNaN(Number(deviceId)) ? Number(deviceId) : deviceId) : undefined,
  };

  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();
  const createTap = useCreateTap();

  const onFormSubmit = async (values: TapMutator): Promise<void> => {
    const tap = await createTap.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: ['taps'] });
    
    if (mergedProps.onTapSetupFinish) {
      await mergedProps.onTapSetupFinish(tap.id);
      return;
    }
    
    router.navigate({
      pathname: '/(tabs)/flow-sensor/new',
      params: {
        tapId: tap.id.toString(),
        shouldReturnOnFinish: 'false',
        showBackButton: mergedProps.showBackButton.toString(),
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
            organizationId={mergedProps.organizationId as EntityID}
          />
        )}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(NewTapScreen, <ErrorScreen shouldShowBackButton />);
